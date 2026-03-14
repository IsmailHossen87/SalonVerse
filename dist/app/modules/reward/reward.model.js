"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseReward = exports.PointIssuedHistory = exports.ViewReward = exports.Reward = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../user/user.interface");
// reward.model.ts
const rewardSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["INVITE", "SALON"], default: "INVITE" },
    title: { type: String },
    discountAmount: { type: Number },
    expiresAt: { type: Date },
    isUsed: { type: Boolean, default: false },
    source: { type: String, enum: ["SYSTEM", "SALON"], default: "SYSTEM" },
    status: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
});
exports.Reward = (0, mongoose_1.model)("Reward", rewardSchema);
const viewRewardSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    salonId: { type: mongoose_1.Types.ObjectId, ref: "Salon" },
    pendingCoins: { type: Number },
    totalCoins: { type: Number },
    status: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.PENDING },
    viewCount: { type: Number, default: 0 },
    lastVisitAt: { type: Date },
    totalShare: { type: Number },
    everyVisitCoins: { type: Number, default: 0 },
    timeZoneBonusCoins: { type: Number, default: 0 },
    totalVisitBonusCoins: { type: Number, default: 0 },
    everyShareBonusCoins: { type: Number, default: 0 }
}, {
    timestamps: true
});
viewRewardSchema.index({ userId: 1, salonId: 1, createdAt: 1 });
exports.ViewReward = (0, mongoose_1.model)("ViewReward", viewRewardSchema);
// PRUCHASE -its generate When admin Approve viewReward
const pointIssuedHistory = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    salonId: { type: mongoose_1.Types.ObjectId, ref: "Salon" },
    points: { type: Number },
    createdAt: { type: Date, default: Date.now },
});
exports.PointIssuedHistory = (0, mongoose_1.model)("PointIssuedHistory", pointIssuedHistory);
const purchaseRewardSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    salonId: { type: mongoose_1.Types.ObjectId, ref: "Salon" },
    rewardId: { type: mongoose_1.Types.ObjectId, ref: "RewardSalon" },
    pointCost: { type: Number },
    status: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.PENDING },
}, { timestamps: true });
exports.PurchaseReward = (0, mongoose_1.model)("PurchaseReward", purchaseRewardSchema);
