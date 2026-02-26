import { Types } from "mongoose";
import { IStatus } from "../user/user.interface";

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

export interface ISalonVisit {
    userId: Types.ObjectId;
    salonId: Types.ObjectId;
    pendingCoins: number;
    status: IStatus;
    viewCount: number;
    lastVisitAt?: Date;
    visitor: number;
}