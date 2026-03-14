"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageValidation = exports.updatePackageSchema = exports.createPackageSchema = void 0;
const zod_1 = require("zod");
const package_constant_1 = require("./package.constant");
exports.createPackageSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().nonempty('Name cannot be empty'),
        price: zod_1.z.number().nonnegative('Price cannot be negative'),
        description: zod_1.z.string().nonempty('Feature cannot be empty'),
        features: zod_1.z.array(zod_1.z.string().nonempty('Feature cannot be empty')).optional(),
        interval: zod_1.z.nativeEnum(package_constant_1.PackageInterval).default(package_constant_1.PackageInterval.MONTH),
        intervalCount: zod_1.z.number().default(1),
        eventCountLimit: zod_1.z.number().default(30),
        googleProductId: zod_1.z
            .string()
            .max(100, 'Android product ID must be within 100 characters')
            .regex(/^[a-z0-9._]+$/, 'Invalid Android product ID')
            .default(''),
        appleProductId: zod_1.z
            .string()
            .max(255, 'iOS product ID must be within 255 characters')
            .regex(/^[A-Za-z0-9.]+$/, 'Invalid iOS product ID')
            .default(''),
    })
        .strict(),
});
exports.updatePackageSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().nonempty('Name cannot be empty').optional(),
        price: zod_1.z.number().nonnegative('Price cannot be negative'),
        description: zod_1.z.string().nonempty('Feature cannot be empty').optional(),
        features: zod_1.z.array(zod_1.z.string().nonempty('Feature cannot be empty')).optional(),
        interval: zod_1.z.nativeEnum(package_constant_1.PackageInterval).optional(),
        intervalCount: zod_1.z.number().optional(),
        eventCountLimit: zod_1.z.number().optional(),
        googleProductId: zod_1.z
            .string()
            .max(100, 'Android product ID must be within 100 characters')
            .regex(/^[a-z0-9._]*$/, 'Invalid Android product ID')
            .optional(),
        appleProductId: zod_1.z
            .string()
            .max(255, 'iOS product ID must be within 255 characters')
            .regex(/^[A-Za-z0-9.]*$/, 'Invalid iOS product ID')
            .optional(),
    })
        .strict(),
});
exports.PackageValidation = {
    createPackageSchema: exports.createPackageSchema,
    updatePackageSchema: exports.updatePackageSchema,
};
