import { model, Schema, Types } from "mongoose";
import { IStatus } from "../user/user.interface";

// reward.model.ts
const rewardSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["INVITE", "SALON"], default: "INVITE" },
    title: { type: String },
    discountAmount: { type: Number },
    expiresAt: { type: Date },
    isUsed: { type: Boolean, default: false },
    source: { type: String, enum: ["SYSTEM", "SALON"], default: "SYSTEM" },
    createdAt: { type: Date, default: Date.now },
});

export const Reward = model("Reward", rewardSchema);

const viewRewardSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    salonId: { type: Types.ObjectId, ref: "Salon" },
    pendingCoins: { type: Number },
    status: { type: String, enum: Object.values(IStatus), default: IStatus.PENDING },
    viewCount: { type: Number, default: 0 },
    lastVisitAt: { type: Date },
});

viewRewardSchema.index({ userId: 1, salonId: 1, createdAt: 1 });
export const ViewReward = model("ViewReward", viewRewardSchema);


const purchaseRewardSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    salonId: { type: Types.ObjectId, ref: "Salon" },
    rewardId: { type: Types.ObjectId, ref: "RewardSalon" },
    status: { type: String, enum: Object.values(IStatus), default: IStatus.PENDING },
});

export const PurchaseReward = model("PurchaseReward", purchaseRewardSchema);
