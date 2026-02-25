import mongoose, { Schema, Types } from "mongoose";

// reward.model.ts
const rewardSchema = new mongoose.Schema({
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true, },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
    rewardName: { type: String, required: true },
    rewardImage: { type: String, required: true },
    rewardPoints: {
        type: Number, required: true,
    },
    service: { type: String, required: true },
    description: { type: String, required: true },
    whatsIncluded: { type: [String], required: true },
    redemptionPolicy: { type: String, required: true },
    rewardStatus: { type: Boolean, default: true },
    purchaseUser: [{ type: Schema.Types.ObjectId, ref: "User" }, { default: [] }]
}, { timestamps: true, versionKey: false })

export const RewardSalonModel = mongoose.model("RewardSalon", rewardSchema);