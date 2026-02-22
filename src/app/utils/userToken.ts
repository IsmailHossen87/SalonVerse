import { IStatus, IUser } from "../modules/user/user.interface"
import { envVar } from "../config/env"
import { generateToken, verifyToken } from "./jwt"
import AppError from "../errorHalper.ts/AppError"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import { UserModel } from "../modules/user/user.model"



export const CreateUserToken = async (userInfo: IUser) => {
    const payload = {
        userId: userInfo._id,
        email: userInfo.email,
        role: userInfo.role
    }

    const accessToken = generateToken(payload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)
    const refreshToken = generateToken(payload, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES_IN)

    const signature = refreshToken.split(".")[2];
    await UserModel.updateOne({ _id: userInfo._id }, { $push: { secretRefreshToken: signature } })
    return { accessToken, refreshToken }
}


export const createNewAccessTokenWinthRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExites = await UserModel.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExites) {
        throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit")
    }
    if (isUserExites.status === IStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.status}`)
    }
    if (isUserExites.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExites._id,
        email: isUserExites.email,
        role: isUserExites.role
    }

    const accessToken = generateToken(jwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)

    return accessToken
}