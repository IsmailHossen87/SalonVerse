// OTP.model.ts
// otpLog.model.ts
import { Schema, model } from "mongoose";

const otpLogSchema = new Schema(
    {
        phoneNumber: String,
        ip: String,
        action: {
            type: String,
            enum: ["SEND", "VERIFY", "FAILED_VERIFY"],
        },
        userAgent: String,
    },
    { timestamps: true }
);

export const OtpLog = model("OtpLog", otpLogSchema);
