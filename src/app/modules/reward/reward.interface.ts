import { Types } from "mongoose";

// reward.interface.ts
export interface IReward {
    userId: Types.ObjectId,
    type: "INVITE" | "SALON",
    title: string,
    discountAmount: number,
    expiresAt: Date,
    isUsed: boolean,
    source: "SYSTEM" | "SALON",
    createdAt: Date
}

