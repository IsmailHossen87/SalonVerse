// reward.service.ts
import { Types } from "mongoose";
import { PurchaseReward, Reward } from "./reward.model";
import { UserModel } from "../user/user.model";
import AppError from "../../errorHalper.ts/AppError";
import httpStatus from "http-status-codes"
import { IStatus, USER_ROLE } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getActiveInviteReward = async (userId: Types.ObjectId) => {
    return await Reward.findOne({
        userId,
        type: "INVITE",
        isUsed: false,
        expiresAt: { $gt: new Date() },
    });
};

const applyReward = async (rewardId: Types.ObjectId) => {
    const reward = await Reward.findById(rewardId);

    if (!reward) {
        throw new Error("Reward not found");
    }

    if (reward.isUsed) {
        throw new Error("Reward already used");
    }

    reward.isUsed = true;
    await reward.save();

    return { message: "Reward applied successfully" };
};

// USER SEE THEIR ACITVE REWARD

const activeReward = async (userId: string, type: string, query: Record<string, string>) => {

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role !== USER_ROLE.USER) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Only user can see their data");
    }

    // Decide status based on type
    const status = type === "active" ? IStatus.PENDING : IStatus.APPROVED;


    const queryBuilder = PurchaseReward.find({
        userId: user._id,
        status
    })
        .populate({ path: "userId", select: "name phoneNumber coins" })
        .populate({ path: "salonId", select: "businessName service image" })
        .populate({ path: "rewardId", select: "rewardPoints rewardName" }).sort({ createdAt: -1 })

    const result = new QueryBuilder(queryBuilder, query).paginate().sort().search([]).filter()

    const [meta, data] = await Promise.all([
        result.getMeta(),
        result.build()
    ])

    if (!data) {
        throw new AppError(httpStatus.NOT_FOUND, "No data found");
    }

    const rewards = await Reward.find({
        userId: user._id,
        status
    })
    const rewardData = rewards.length > 0 ? rewards : [];

    return { meta, data: { ...data, rewards: rewardData } };
};



export const RewardService = {
    getActiveInviteReward,
    applyReward,
    activeReward
};
