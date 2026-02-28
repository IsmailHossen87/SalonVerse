import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { UserModel } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IStatus } from "../modules/user/user.interface";
import AppError from "../errorHalper.ts/AppError";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization;
        // const tokenWithBearer = req.headers.authorization;
        // if(!tokenWithBearer){
        //     throw new AppError(httpStatus.BAD_REQUEST, "No Token Recieved")
        // }
        // const accessToken = tokenWithBearer.split(' ')[1];     // tokenWithBearer.startsWith('Bearer')

        if (!accessToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Token Recieved")
        }

        const verifyedToken = verifyToken(accessToken, envVar.JWT_SECRET) as JwtPayload

        const isUserExites = await UserModel.findOne({ _id: verifyedToken.userId })

        if (!isUserExites) {
            throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit")
        }
        if (isUserExites.status === IStatus.BLOCKED || isUserExites.status === IStatus.DELETED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.status}`)
        }
        // if (isUserExites.isDeleted) {
        //     throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        // }
        if (!isUserExites.verified) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
        }


        if (!authRoles.includes(verifyedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "Your are not Permitted to view this route")
        }
        // global authentication er jonno
        req.user = verifyedToken
        next()

    } catch (err) {
        next(err)
    }
}

