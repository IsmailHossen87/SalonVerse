"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpLog = void 0;
// OTP.model.ts
// otpLog.model.ts
const mongoose_1 = require("mongoose");
const otpLogSchema = new mongoose_1.Schema({
    phoneNumber: String,
    ip: String,
    action: {
        type: String,
        enum: ["SEND", "VERIFY", "FAILED_VERIFY"],
    },
    userAgent: String,
}, { timestamps: true });
exports.OtpLog = (0, mongoose_1.model)("OtpLog", otpLogSchema);
