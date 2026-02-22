// reward.service.ts
import { Types } from "mongoose";
import { Reward } from "./reward.model";

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

export const RewardService = {
    getActiveInviteReward,
    applyReward,
};
