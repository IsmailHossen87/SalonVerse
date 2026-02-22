// invite.service.ts
import { Invite } from "./invite.model";
import { Reward } from "../reward/reward.model";
import { Types } from "mongoose";
import { IStatus } from "../user/user.interface";

const completeInvite = async (
    inviterId: Types.ObjectId,
    invitedUserId: Types.ObjectId
) => {

    // 1️⃣ Check already exists
    const existing = await Invite.findOne({ inviter: inviterId, invitedUser: invitedUserId, });

    if (existing) {
        throw new Error("Invite already recorded");
    }

    // 2️⃣ Create invite record
    await Invite.create({
        inviter: inviterId,
        invitedUser: invitedUserId,
        status: IStatus.COMPLETED,
        createdAt: new Date(),
    });

    // 3️⃣ Count completed invites
    const totalCompleted = await Invite.countDocuments({
        inviter: inviterId,
        status: IStatus.COMPLETED,
    });

    // 4️⃣ If completed = 3 → generate reward
    if (totalCompleted === 3) {
        const alreadyRewarded = await Reward.findOne({
            userId: inviterId,
            type: "INVITE",
        });

        if (!alreadyRewarded) {
            await Reward.create({
                userId: inviterId,
                type: "INVITE",
                title: "Invite Reward - 20 AED",
                discountAmount: 20,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isUsed: false,
                source: "SYSTEM",
                createdAt: new Date(),
            });
        }
    }

    return { message: "Invite completed successfully" };
};

export const InviteService = {
    completeInvite,
};
