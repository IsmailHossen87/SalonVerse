"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionValidations = exports.createSubscriptionSchema = void 0;
const zod_1 = require("zod");
const subscription_constants_1 = require("./subscription.constants");
exports.createSubscriptionSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        package: zod_1.z.string().min(24, 'Invalid package ID').nonempty('Package ID is required'),
        platform: zod_1.z.nativeEnum(subscription_constants_1.SubscriptionPlatform),
        purchaseToken: zod_1.z
            .union([
            zod_1.z
                .string()
                .min(20, 'Purchase token too short')
                .max(255, 'Purchase token too long')
                .regex(/^[A-Za-z0-9._-]+$/, 'Invalid purchase token'),
            zod_1.z.null(),
        ])
            .optional(),
        transactionReceipt: zod_1.z
            .union([
            zod_1.z
                .string()
                .min(100, 'Receipt too short')
                .max(5000, 'Receipt too long')
                .regex(/^[A-Za-z0-9+/=]+$/, 'Invalid receipt format'),
            zod_1.z.null(),
        ])
            .optional(),
    })
        .superRefine((data, context) => {
        if (data.platform === subscription_constants_1.SubscriptionPlatform.GOOGLE) {
            if (!data.purchaseToken) {
                context.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: 'Purchase token is required for Google Play subscriptions',
                });
            }
        }
        else if (data.platform === subscription_constants_1.SubscriptionPlatform.APPLE) {
            if (!data.transactionReceipt) {
                context.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: 'Transaction receipt is required for Apple subscriptions',
                });
            }
        }
    }),
});
exports.SubscriptionValidations = {
    createSubscriptionSchema: exports.createSubscriptionSchema,
};
