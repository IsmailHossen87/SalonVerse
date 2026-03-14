"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const mongoose_1 = require("mongoose");
const package_constant_1 = require("./package.constant");
const packageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: { type: [String] },
    interval: {
        type: String,
        enum: Object.values(package_constant_1.PackageInterval),
        default: package_constant_1.PackageInterval.MONTH,
    },
    intervalCount: { type: Number, default: 1 },
    eventCountLimit: { type: Number, default: 30 },
    googleProductId: { type: String, default: '' },
    appleProductId: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.Package = (0, mongoose_1.model)('Package', packageSchema);
