"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionStatus = exports.SubscriptionPlatform = void 0;
var SubscriptionPlatform;
(function (SubscriptionPlatform) {
    SubscriptionPlatform["GOOGLE"] = "google";
    SubscriptionPlatform["APPLE"] = "apple";
})(SubscriptionPlatform || (exports.SubscriptionPlatform = SubscriptionPlatform = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["PENDING"] = "pending";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
