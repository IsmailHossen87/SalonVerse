// OTP.service.ts
import twilio from "twilio";
import httpStatus from "http-status-codes";
import { OtpLog } from "./OTP.model";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHalper.ts/AppError";

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

/* ================= SEND OTP ================= */

export const sendOTPService = async (
    phoneNumber: string,
    ip: string,
    userAgent: string
) => {
    // 📌 Rate Limit: 5 OTP per phone per hour
    const phoneRate = await redisClient.incr(`otp:rate:phone:${phoneNumber}`);
    if (phoneRate === 1)
        await redisClient.expire(`otp:rate:phone:${phoneNumber}`, 3600);
    if (phoneRate > 5)
        throw new AppError(429, "Max OTP per phone per hour reached");

    // 📌 Rate Limit: 10 per IP per hour
    const ipRate = await redisClient.incr(`otp:rate:ip:${ip}`);
    if (ipRate === 1) await redisClient.expire(`otp:rate:ip:${ip}`, 3600);
    if (ipRate > 10)
        throw new AppError(429, "Too many OTP requests from this IP");

    // 📌 Resend cooldown (60 sec)
    const cooldown = await redisClient.get(`otp:cooldown:${phoneNumber}`);
    if (cooldown)
        throw new AppError(429, "Wait 60 seconds before resend");

    // 📌 Max 3 resend per hour
    const resendCount = await redisClient.incr(`otp:resend:${phoneNumber}`);
    if (resendCount === 1)
        await redisClient.expire(`otp:resend:${phoneNumber}`, 3600);
    if (resendCount > 3)
        throw new AppError(429, "Max 3 resends per hour reached");


    const redisKey = `otp:cooldown:${phoneNumber}`
    await redisClient.set(redisKey, "1", {
        EX: 60,
    });

    // 📌 Send via Twilio
    await client.verify.v2
        .services(SERVICE_SID)
        .verifications.create({ to: phoneNumber, channel: "sms" });

    await OtpLog.create({
        phoneNumber,
        ip,
        action: "SEND",
        userAgent,
    });

    return true;
};

/* ================= VERIFY OTP ================= */

export const verifyOTPService = async (
    phoneNumber: string,
    code: string,
    // ip: string,
    // userAgent: string
) => {
    // 📌 Max 5 attempts in 5 min
    const attempts = await redisClient.incr(`otp:attempts:${phoneNumber}`);
    if (attempts === 1)
        await redisClient.expire(`otp:attempts:${phoneNumber}`, 300);

    if (attempts > 5)
        throw new AppError(429, "Too many verification attempts");

    const result = await client.verify.v2
        .services(SERVICE_SID)
        .verificationChecks.create({ to: phoneNumber, code });

    if (result.status !== "approved") {
        await OtpLog.create({
            phoneNumber,
            // ip,
            action: "FAILED_VERIFY",
            // userAgent,
        });

        throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
    }

    await redisClient.del(`otp:attempts:${phoneNumber}`);

    await OtpLog.create({
        phoneNumber,
        // ip,
        action: "VERIFY",
        // userAgent,
    });

    return true;
};
