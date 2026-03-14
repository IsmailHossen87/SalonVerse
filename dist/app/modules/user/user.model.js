"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
});
// user.model.ts
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, },
    role: { type: String, enum: Object.values(user_interface_1.USER_ROLE), default: user_interface_1.USER_ROLE.USER, },
    image: { type: String, },
    phoneNumber: { type: String, unique: true, required: true },
    personalInfo: {
        address: { type: String, },
        city: { type: String, },
        country: { type: String, },
        zipCode: { type: String, },
    },
    dateOfBirth: { type: Date, },
    secretRefreshToken: { type: [String], default: [], select: false },
    auths: [authProviderSchema],
    verified: { type: Boolean, default: false, },
    status: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.PENDING, },
    notification: { type: Boolean, default: false },
    isVibrationNotificationEnabled: { type: Boolean, default: true, },
    isSoundNotificationEnabled: { type: Boolean, default: true, },
    fcmToken: { type: String, select: false },
    coins: { type: Number, default: 0 },
    spentCoins: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    invitedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    successfulInvites: { type: Number, default: 0 },
    // Payment ----------💸💸💸
    stripeAccountInfo: {
        stripeAccountId: { type: String, },
    },
    stripeConnectedAccount: { type: String, },
    isCompleted: { type: Boolean, default: false, },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    isOnline: { type: Boolean, default: false, },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', exports.UserSchema);
