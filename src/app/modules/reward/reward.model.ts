import { model, Schema, Types } from "mongoose";

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