import AppError from "../../errorHalper.ts/AppError";
import { firebaseAdmin } from "../../middleware/firebaseAdmin";
import { UserModel } from "../user/user.model";
import { IAuthProvider, IStatus, IUser, USER_ROLE } from "../user/user.interface";
import { CreateUserToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { envVar } from "../../config/env";
import { redisClient } from "../../config/redis.config";
import generateNumber, { generateHashCode } from "../../utils/generate";
import { sendEmail } from "../../utils/sendEmail";
import { INOTIFICATION_EVENT, INOTIFICATION_TYPE } from "../notification/notification.interface";
import { firebaseNotificationBuilder } from "../../shared/sendNotification";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { createNewAccessTokenWinthRefreshToken } from "../../utils/userToken";

// 🔥 NEW: Google Login Service
const googleLogin = async (idToken: string) => {
    try {
        // Firebase দিয়ে ID Token verify করা
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        if (!email) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email not found in token");
        }

        // Check if user already exists
        let user = await UserModel.findOne({ email }).select("auths");
        let isNewUser = false;

        if (!user) {
            isNewUser = true;

            const googleAuthProvider: IAuthProvider = {
                provider: "google",
                providerId: uid
            };

            user = await UserModel.create({
                name: name || email.split('@')[0],
                email,
                image: picture,
                role: USER_ROLE.USER,
                status: IStatus.ACTIVE,
                verified: true,
                auths: [googleAuthProvider],
            });
        } else {
            // Existing user - check if Google auth already added
            const hasGoogleAuth = user.auths.some(
                auth => auth.provider === "google" && auth.providerId === uid
            );

            if (!hasGoogleAuth) {
                // Google auth যোগ করা
                user.auths.push({
                    provider: "google",
                    providerId: uid
                });
                await user.save();
            }
        }

        // JWT Token generate করা
        const tokens = await CreateUserToken(user);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            },
            isNewUser
        };

    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token expired");
        }
        if (error.code === 'auth/argument-error') {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid token");
        }
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Google authentication failed");
    }
};


const loginCredential = async (data: { phoneNumber: string; otp: string }) => {
    // OTP verify
    // try {
    //     await verifyOTPCode(data.phoneNumber, data.otp);
    // } catch (err) {
    //     throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired OTP");
    // }

    const result = await UserModel.findOne({ phoneNumber: data.phoneNumber });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (result.status !== IStatus.ACTIVE) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is not active");
    }

    const token = await CreateUserToken(result);
    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    };
};

const loginSuperAdmin = async (data: IUser) => {
    const result = await UserModel.findOne({ email: data.email })
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if (!result.verified) throw new AppError(httpStatus.UNAUTHORIZED, "User not verified")

    const isPasswordMatched = await bcrypt.compare(data.password, result.password)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Password not matched")
    }
    const token = await CreateUserToken(result)
    // 🔔🔔🪧🔔🔔
    if (result?.fcmToken) {
        await firebaseNotificationBuilder({
            user: result,
            title: "Welcome Backe",
            body: "You've successfully logged in",
            notificationEvent: INOTIFICATION_EVENT.LOGIN,
            notificationType: INOTIFICATION_TYPE.NOTIFICATION,
            referenceId: result._id,
            referenceType: "User"
        })
    }


    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    }
}


// RefreshToken
const refreshToken = async (data: { refreshToken: string }) => {
    const { refreshToken } = data
    const accessToken = await createNewAccessTokenWinthRefreshToken(refreshToken)
    return { accessToken }
}

const logout = async (data: { refreshToken: string }) => {
    const { refreshToken } = data;

    const decoded = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload;


    const user = await UserModel.findOne({ email: decoded.email }).select("secretRefreshToken");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const signature = refreshToken.split(".")[2];

    await UserModel.updateOne(
        { _id: user._id },
        { $pull: { secretRefreshToken: signature } }
    );

    return { message: "Logout successful" };
};



// ------------------------------------  OTP Send & Verify  ------------------------------------
const sendOtp = async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const otp = generateNumber()
    const hashCode = generateHashCode(user)

    const redisKey = `email:${email}:${hashCode}`

    await redisClient.set(redisKey, otp.toString(), {
        EX: 60 * 2
    })

    await sendEmail({
        to: email,
        subject: "OTP Verification",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp: otp
        }
    })

    return { otp, hashCode }
}

const userVerify = async (data: {
    email: string
    otp: number
    hash: string
}) => {
    const { email, otp, hash } = data

    const redisKey = `email:${email}:${hash}`
    const storedOTP = await redisClient.get(redisKey)

    if (!storedOTP) {
        throw new AppError(httpStatus.BAD_REQUEST, "OTP expired or invalid")
    }

    if (storedOTP !== String(otp)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Wrong OTP")
    }

    // OTP verified → delete from Redis
    await redisClient.del(redisKey)

    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if (user.verified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already verified")
    }

    user.verified = true
    await user.save()

    return { message: "OTP verified successfully" }
}

const forgetPassword = async (data: { email: string, otp: number, hash: string, password: string }) => {
    const { email, otp, hash, password } = data

    const redisKey = `email:${email}:${hash}`
    const storedOTP = await redisClient.get(redisKey)

    if (!storedOTP) {
        throw new AppError(httpStatus.BAD_REQUEST, "OTP expired or invalid")
    }

    if (storedOTP !== String(otp)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Wrong OTP")
    }

    await redisClient.del(redisKey)

    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await UserModel.updateOne(
        { email },
        { $set: { password: hashedPassword } }
    )

    if (result.modifiedCount === 0) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Password was not updated"
        )
    }

    await sendEmail({
        to: email,
        subject: "Password Reset Successful",
        templateName: "forget",
        templateData: {
            name: user.name,
        }
    })

    return { message: "Password reset successfully" }
}

// CHANGE PASSWORD
const changePassword = async (data: { oldPassword: string, newPassword: string, user: JwtPayload }) => {
    const { oldPassword, newPassword, user } = data

    const userInfo = await UserModel.findOne({ email: user.email })
    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, userInfo.password)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Password not matched")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const result = await UserModel.updateOne(
        { email: user.email },
        { $set: { password: hashedPassword } }
    )

    if (result.modifiedCount === 0) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Password was not updated"
        )
    }

    return { message: "Password reset successfully" }
}


export const authService = {
    loginCredential,
    loginSuperAdmin,
    refreshToken,
    logout,
    sendOtp,
    userVerify,
    forgetPassword,
    changePassword,
    googleLogin
}
