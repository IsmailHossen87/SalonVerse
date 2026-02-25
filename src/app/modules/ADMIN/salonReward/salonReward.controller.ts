// reward.controller.ts
// salon.controller.ts
import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../utils/catchAsync";
import { salonRewardService } from "./salonReward.service";

const createSalonReward = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.rewardImage = `image/${req.files.image[0].filename}`;
    }

    const user = req.user.userId;
    const result = await salonRewardService.createReward(req.body, user);

    res.status(200).json({
        success: true,
        message: "Reward created successfully",
        data: result,
    });
});

const getAllSalonReward = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await salonRewardService.getAllSalonReward(req.query);
    res.status(200).json({
        success: true,
        message: "All salon rewards fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleSalonReward = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.userId;
    const result = await salonRewardService.getSingleSalonReward(req.params.id as string, user as string);
    res.status(200).json({
        success: true,
        message: "Salon reward fetched successfully",
        data: result,
    });
});

const updateSalonReward = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.rewardImage = `image/${req.files.image[0].filename}`;
    }
    const result = await salonRewardService.updateSalonReward(req.params.id as string, req.body);
    res.status(200).json({
        success: true,
        message: "Salon reward updated successfully",
        data: result,
    });
});

// 🛄🛄🛄 clain reward
const claimReward = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.userId;
    const result = await salonRewardService.claimReward(req.params.id as string, user as string);
    res.status(200).json({
        success: true,
        message: "Salon reward clain successfully",
        data: result,
    });
});

// 🛄🛄🛄 clain reward
const approveRedemption = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.userId;
    const result = await salonRewardService.approveRedemption(req.params.id as string, user as string);
    res.status(200).json({
        success: true,
        message: "Approved redemption successfully",
        data: result,
    });
});

const getAllRedemption = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.userId;
    const result = await salonRewardService.getAllRedemption(req.query, user as string);
    res.status(200).json({
        success: true,
        message: "All Purchase rewards fetched successfully",
        meta: result.meta,
        statusCount: result.statusCount,
        data: result.data,
    });
});
export const salonRewardController = {
    createSalonReward,
    getAllSalonReward,
    getSingleSalonReward,
    updateSalonReward,
    claimReward,
    approveRedemption,
    getAllRedemption
};