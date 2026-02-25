
// src/services/otp.service.ts
import twilio from "twilio";
import { envVar } from "../config/env";

const client = twilio(envVar.TWILIO_ACCOUNT_SID, envVar.TWILIO_AUTH_TOKEN);

export const sendOTP = async (phoneNumber: string) => {
    // phoneNumber: +966XXXXXXXXX
    const result = await client.verify.v2
        .services(envVar.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: phoneNumber, channel: "sms" });
    console.log("Twillio CHeck", result)
};

export const verifyOTP = async (phoneNumber: string, code: string) => {
    const result = await client.verify.v2
        .services(envVar.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: phoneNumber, code });

    if (result.status !== "approved") {
        throw new Error("Invalid or expired OTP");
    }

    return true;
};