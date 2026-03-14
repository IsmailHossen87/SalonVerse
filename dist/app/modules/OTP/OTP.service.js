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
exports.verifyOTPService = exports.sendOTPService = void 0;
// OTP.service.ts
const twilio_1 = __importDefault(require("twilio"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const OTP_model_1 = require("./OTP.model");
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
/* ================= SEND OTP ================= */
const sendOTPService = (phoneNumber, ip, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    // 📌 Rate Limit: 5 OTP per phone per hour
    const phoneRate = yield redis_config_1.redisClient.incr(`otp:rate:phone:${phoneNumber}`);
    if (phoneRate === 1)
        yield redis_config_1.redisClient.expire(`otp:rate:phone:${phoneNumber}`, 3600);
    if (phoneRate > 5)
        throw new AppError_1.default(429, "Max OTP per phone per hour reached");
    // 📌 Rate Limit: 10 per IP per hour
    const ipRate = yield redis_config_1.redisClient.incr(`otp:rate:ip:${ip}`);
    if (ipRate === 1)
        yield redis_config_1.redisClient.expire(`otp:rate:ip:${ip}`, 3600);
    if (ipRate > 10)
        throw new AppError_1.default(429, "Too many OTP requests from this IP");
    // 📌 Resend cooldown (60 sec)
    const cooldown = yield redis_config_1.redisClient.get(`otp:cooldown:${phoneNumber}`);
    if (cooldown)
        throw new AppError_1.default(429, "Wait 60 seconds before resend");
    // 📌 Max 3 resend per hour
    const resendCount = yield redis_config_1.redisClient.incr(`otp:resend:${phoneNumber}`);
    if (resendCount === 1)
        yield redis_config_1.redisClient.expire(`otp:resend:${phoneNumber}`, 3600);
    if (resendCount > 3)
        throw new AppError_1.default(429, "Max 3 resends per hour reached");
    const redisKey = `otp:cooldown:${phoneNumber}`;
    yield redis_config_1.redisClient.set(redisKey, "1", {
        EX: 60,
    });
    // 📌 Send via Twilio
    yield client.verify.v2
        .services(SERVICE_SID)
        .verifications.create({ to: phoneNumber, channel: "sms" });
    yield OTP_model_1.OtpLog.create({
        phoneNumber,
        ip,
        action: "SEND",
        userAgent,
    });
    return true;
});
exports.sendOTPService = sendOTPService;
/* ================= VERIFY OTP ================= */
const verifyOTPService = (phoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    // 📌 Max 5 attempts in 5 min
    const attempts = yield redis_config_1.redisClient.incr(`otp:attempts:${phoneNumber}`);
    if (attempts === 1)
        yield redis_config_1.redisClient.expire(`otp:attempts:${phoneNumber}`, 300);
    if (attempts > 5)
        throw new AppError_1.default(429, "Too many verification attempts");
    const result = yield client.verify.v2
        .services(SERVICE_SID)
        .verificationChecks.create({ to: phoneNumber, code });
    if (result.status !== "approved") {
        yield OTP_model_1.OtpLog.create({
            phoneNumber,
            // ip,
            action: "FAILED_VERIFY",
            // userAgent,
        });
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid or expired OTP");
    }
    yield redis_config_1.redisClient.del(`otp:attempts:${phoneNumber}`);
    yield OTP_model_1.OtpLog.create({
        phoneNumber,
        // ip,
        action: "VERIFY",
        // userAgent,
    });
    return true;
});
exports.verifyOTPService = verifyOTPService;
