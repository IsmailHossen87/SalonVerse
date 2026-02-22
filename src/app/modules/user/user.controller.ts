import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

// ✅ নতুন: OTP পাঠানো
const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const result = await userService.sendRegistrationOTP(phoneNumber);
    res.status(200).json({
        success: true,
        message: result.message,
        data: null,
    });
});

// ✅ Updated: OTP verify + create
const createUser = catchAsync(async (req: Request, res: Response) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`;
    }
    const result = await userService.createUser(req.body);
    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: null,
    });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const result = await userService.getAllUser(user, req.query);
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: { ...result },
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`;
    }
    const owner = req.user as JwtPayload;
    const result = await userService.updateUser(req.body, owner);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

const userDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const result = await userService.userDetails(userId);
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const owner = req.user as JwtPayload;
    const { userId } = req.query;
    const { password } = req.body;
    const result = await userService.deleteUser(owner, userId as string, password as string);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

export const userController = {
    sendOTP,
    createUser,
    getAllUser,
    updateUser,
    userDetails,
    deleteUser,
};