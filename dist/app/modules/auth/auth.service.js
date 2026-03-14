"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const firebaseAdmin_1 = require("../../middleware/firebaseAdmin");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const userToken_1 = require("../../utils/userToken");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const redis_config_1 = require("../../config/redis.config");
const generate_1 = __importStar(require("../../utils/generate"));
const sendEmail_1 = require("../../utils/sendEmail");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userToken_2 = require("../../utils/userToken");
// 🔥 NEW: Google Login Service
const googleLogin = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Firebase দিয়ে ID Token verify করা
        const decodedToken = yield firebaseAdmin_1.firebaseAdmin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;
        if (!email) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email not found in token");
        }
        // Check if user already exists
        let user = yield user_model_1.UserModel.findOne({ email }).select("auths");
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            const googleAuthProvider = {
                provider: "google",
                providerId: uid
            };
            user = yield user_model_1.UserModel.create({
                name: name || email.split('@')[0],
                email,
                image: picture,
                role: user_interface_1.USER_ROLE.USER,
                status: user_interface_1.IStatus.ACTIVE,
                verified: true,
                auths: [googleAuthProvider],
            });
        }
        else {
            // Existing user - check if Google auth already added
            const hasGoogleAuth = user.auths.some(auth => auth.provider === "google" && auth.providerId === uid);
            if (!hasGoogleAuth) {
                // Google auth যোগ করা
                user.auths.push({
                    provider: "google",
                    providerId: uid
                });
                yield user.save();
            }
        }
        // JWT Token generate করা
        const tokens = yield (0, userToken_1.CreateUserToken)(user);
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
    }
    catch (error) {
        if (error.code === 'auth/id-token-expired') {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Token expired");
        }
        if (error.code === 'auth/argument-error') {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid token");
        }
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Google authentication failed");
    }
});
const loginCredential = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // OTP verify
    // try {
    //     await verifyOTPCode(data.phoneNumber, data.otp);
    // } catch (err) {
    //     throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired OTP");
    // }
    const result = yield user_model_1.UserModel.findOne({ phoneNumber: data.phoneNumber });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (result.status !== user_interface_1.IStatus.ACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User is not active");
    }
    const token = yield (0, userToken_1.CreateUserToken)(result);
    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: result._id
    };
});
const loginSuperAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findOne({ email: data.email, role: data.role }).select("name email role image verified password");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!result.verified)
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not verified");
    const isPasswordMatched = yield bcrypt_1.default.compare(data.password, result.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Password not matched");
    }
    const token = yield (0, userToken_1.CreateUserToken)(result);
    // 🔔🔔🪧🔔🔔
    return {
        user: {
            _id: result._id,
            name: result.name,
            email: result.email,
            role: result.role,
            image: result.image,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    };
});
// RefreshToken
const refreshToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = data;
    const accessToken = yield (0, userToken_2.createNewAccessTokenWinthRefreshToken)(refreshToken);
    return { accessToken };
});
const logout = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = data;
    const decoded = (0, jwt_1.verifyToken)(refreshToken, env_1.envVar.JWT_REFRESH_SECRET);
    const user = yield user_model_1.UserModel.findOne({ email: decoded.email }).select("secretRefreshToken");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const signature = refreshToken.split(".")[2];
    yield user_model_1.UserModel.updateOne({ _id: user._id }, { $pull: { secretRefreshToken: signature } });
    return { message: "Logout successful" };
});
// ------------------------------------  OTP Send & Verify  ------------------------------------
const sendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const otp = (0, generate_1.default)();
    const hashCode = (0, generate_1.generateHashCode)(user);
    const redisKey = `email:${email}:${hashCode}`;
    yield redis_config_1.redisClient.set(redisKey, otp.toString(), {
        EX: 60 * 2
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "OTP Verification",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp: otp
        }
    });
    return { otp, hashCode };
});
const userVerify = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, hash } = data;
    const redisKey = `email:${email}:${hash}`;
    const storedOTP = yield redis_config_1.redisClient.get(redisKey);
    if (!storedOTP) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "OTP expired or invalid");
    }
    if (storedOTP !== String(otp)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wrong OTP");
    }
    // OTP verified → delete from Redis
    yield redis_config_1.redisClient.del(redisKey);
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.verified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already verified");
    }
    user.verified = true;
    yield user.save();
    return { message: "OTP verified successfully" };
});
const forgetPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, hash, password } = data;
    const redisKey = `email:${email}:${hash}`;
    const storedOTP = yield redis_config_1.redisClient.get(redisKey);
    if (!storedOTP) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "OTP expired or invalid");
    }
    if (storedOTP !== String(otp)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wrong OTP");
    }
    yield redis_config_1.redisClient.del(redisKey);
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const result = yield user_model_1.UserModel.updateOne({ email }, { $set: { password: hashedPassword } });
    if (result.modifiedCount === 0) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Password was not updated");
    }
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Password Reset Successful",
        templateName: "forget",
        templateData: {
            name: user.name,
        }
    });
    return { message: "Password reset successfully" };
});
// CHANGE PASSWORD
const changePassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, user } = data;
    const userInfo = yield user_model_1.UserModel.findOne({ email: user.email });
    if (!userInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(oldPassword, userInfo.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Password not matched");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    const result = yield user_model_1.UserModel.updateOne({ email: user.email }, { $set: { password: hashedPassword } });
    if (result.modifiedCount === 0) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Password was not updated");
    }
    return { message: "Password reset successfully" };
});
exports.authService = {
    loginCredential,
    loginSuperAdmin,
    refreshToken,
    logout,
    sendOtp,
    userVerify,
    forgetPassword,
    changePassword,
    googleLogin
};
