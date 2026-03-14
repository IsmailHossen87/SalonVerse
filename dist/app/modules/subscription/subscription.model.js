"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscription_constants_1 = require("./subscription.constants");
const subscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    package: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
        index: true,
    },
    platform: {
        type: String,
        enum: Object.values(subscription_constants_1.SubscriptionPlatform),
        required: true,
    },
    price: { type: Number, required: true },
    // Package usage details
    remainingEventCount: { type: Number, required: true },
    packageEventCountLimit: { type: Number, required: true },
    pricePerEvent: { type: Number, required: true },
    usedEventCount: { type: Number, required: true },
    remainingAllowedRefundAmount: { type: Number, required: true },
    isRefunded: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    googleProductId: { type: String },
    appleProductId: { type: String },
    purchaseToken: { type: String },
    orderId: { type: String },
    transactionId: { type: String },
    originalTransactionId: { type: String },
    status: {
        type: String,
        enum: Object.values(subscription_constants_1.SubscriptionStatus),
        default: subscription_constants_1.SubscriptionStatus.PENDING,
    },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date },
    canceledAt: { type: Date },
    renewalCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
subscriptionSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscription = this;
        if (subscription.packageEventCountLimit < subscription.usedEventCount) {
            throw new Error('Used event count cannot be greater than package event count limit');
        }
        // next();
    });
});
exports.Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
