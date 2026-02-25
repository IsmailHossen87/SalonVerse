import { Types } from "mongoose";

// reward.interface.ts
export interface ISalonReward {
    salonId: Types.ObjectId;
    ownerId: Types.ObjectId;
    rewardName: string;
    rewardImage: string;
    rewardPoints: number;

    service: string;
    description: string;
    whatsIncluded: string[];
    redemptionPolicy: string;

    rewardStatus: boolean;
    VisitorCoin: number;
    purchaseUser: Types.ObjectId[];
}
