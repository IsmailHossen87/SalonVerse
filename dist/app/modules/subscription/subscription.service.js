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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionServices = exports.createSubscriptionIntoDB = void 0;
const http_status_codes_1 = require("http-status-codes");
const package_model_1 = require("../package/package.model");
const subscription_model_1 = require("./subscription.model");
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const createSubscriptionIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the package is valid
    const pkg = yield package_model_1.Package.findById(payload.package);
    if (!pkg) {
        throw new Error('Package does not exist');
    }
    // let verificationResult: GoogleVerificationResult & AppleVerificationResult;
    // let verificationResult: GoogleVerificationResult & AppleVerificationResult = {
    //      valid: true,
    //      startedAt: new Date('2026-01-01T12:00:00Z'),
    //      expiresAt: new Date('2027-01-01T12:00:00Z'),
    //      status: SubscriptionStatus.ACTIVE,
    //      orderId: 'order_12345',
    //      linkedPurchaseToken: 'purchase_token_98765',
    // };
    // if (payload.platform === SubscriptionPlatform.GOOGLE) {
    //      if (!payload.purchaseToken) {
    //           throw new AppError(StatusCodes.BAD_REQUEST, 'Purchase token is required for Google Play subscriptions');
    //      }
    //      if (!pkg.googleProductId) {
    //           throw new AppError(StatusCodes.BAD_REQUEST, 'Google Play product id is required for Google Play subscriptions');
    //      }
    //      verificationResult = await verifyGooglePurchase(payload.purchaseToken, pkg.googleProductId);
    // } else if (payload.platform === SubscriptionPlatform.APPLE) {
    //      if (!payload.transactionReceipt) {
    //           throw new AppError(StatusCodes.BAD_REQUEST, 'Transaction receipt is required for Apple subscriptions');
    //      }
    //      if (!pkg.appleProductId) {
    //           throw new AppError(StatusCodes.BAD_REQUEST, 'Apple product id is required for Apple subscriptions');
    //      }
    //      verificationResult = await verifyAppleReceipt(payload.transactionReceipt, pkg.appleProductId);
    // } else {
    //      throw new Error('Unsupported platform');
    // }
    // if (!verificationResult.valid) {
    //      return { success: false, message: 'Subscription verification failed' };
    // }
    // const subscription = await Subscription.create({
    //      user: payload.user,
    //      package: payload.package,
    //      platform: payload.platform,
    //      price: pkg.price,
    //      // Package usage details
    //      remainingEventCount: pkg.eventCountLimit,
    //      packageEventCountLimit: pkg.eventCountLimit,
    //      pricePerEvent: Number(pkg.price / pkg.eventCountLimit),
    //      usedEventCount: 0,
    //      remainingAllowedRefundAmount: pkg.price,
    //      isRefunded: false,
    //      googleProductId: pkg.googleProductId,
    //      appleProductId: pkg.appleProductId,
    //      purchaseToken: payload.purchaseToken,
    //      orderId: verificationResult.orderId,
    //      transactionId: verificationResult.transactionId,
    //      originalTransactionId: verificationResult.originalTransactionId,
    //      status: verificationResult.status,
    //      startedAt: verificationResult.startedAt,
    //      expiresAt: verificationResult.expiresAt,
    // });
    // if (!subscription) {
    //      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create subscription');
    // }
    // // update user subscription
    // await UserModel.findByIdAndUpdate(payload.user, {
    //      subscription: subscription._id,
    // });
    // return subscription;
});
exports.createSubscriptionIntoDB = createSubscriptionIntoDB;
const updateSubscriptionUsages = (id, mongooseTransactionSession) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscription_model_1.Subscription.findById(id);
    if (!subscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found');
    }
    if (subscription.isExpired) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is already expired. Can not use');
    }
    if (subscription.isRefunded) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is already refunded. Can not use');
    }
    if (subscription.usedEventCount >= subscription.packageEventCountLimit) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription Limit is expired. Can not use');
    }
    subscription.usedEventCount += 1;
    subscription.remainingEventCount -= 1;
    subscription.remainingAllowedRefundAmount -= Number(subscription.pricePerEvent * subscription.usedEventCount);
    if (mongooseTransactionSession) {
        // subscription.save({ session: mongooseTransactionSession });
        if (subscription.usedEventCount >= subscription.packageEventCountLimit) {
            subscription.isExpired = true;
            subscription.save({ session: mongooseTransactionSession });
        }
        else {
            subscription.save({ session: mongooseTransactionSession });
        }
    }
    else {
        if (subscription.usedEventCount >= subscription.packageEventCountLimit) {
            subscription.isExpired = true;
            yield subscription.save();
        }
        else {
            yield subscription.save();
        }
    }
});
exports.SubscriptionServices = {
    createSubscriptionIntoDB: exports.createSubscriptionIntoDB,
    updateSubscriptionUsages,
};
