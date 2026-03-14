"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVar = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    var _a;
    const requiredVariables = [
        "PORT",
        "DB_URL",
        "JWT_SECRET",
        "JWT_EXPIRES_IN",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES_IN",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_PASSWORD",
        "REDIS_USERNAME",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_FROM",
        "FIREBASE_TYPE",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_PRIVATE_KEY_ID",
        "FIREBASE_PRIVATE_KEY",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_CLIENT_ID",
        "FIREBASE_AUTH_URI",
        "FIREBASE_TOKEN_URI",
        "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
        "FIREBASE_CLIENT_X509_CERT_URL",
        "FIREBASE_UNIVERSE_DOMAIN",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_SUCCESS_URL",
        "STRIPE_CANCEL_URL",
        "BACKEND_URL",
        "FRONTEND_URL",
        "FRONTEND_URL_DASHBOARD",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "BCRYPT_SALT_ROUTD",
        "TWILIO_ACCOUNT_SID",
        "TWILIO_AUTH_TOKEN",
        "TWILIO_VERIFY_SERVICE_SID",
        "GOOGLE_MAP_KEY"
    ];
    requiredVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        ip_address: process.env.ip_address,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        BACKEND_URL: process.env.BACKEND_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        FRONTEND_URL_DASHBOARD: process.env.FRONTEND_URL_DASHBOARD,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        BCRYPT_SALT_ROUTD: process.env.BCRYPT_SALT_ROUTD,
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID,
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        FIREBASE: {
            type: process.env.FIREBASE_TYPE,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            clientId: process.env.FIREBASE_CLIENT_ID,
            authUri: process.env.FIREBASE_AUTH_URI,
            tokenUri: process.env.FIREBASE_TOKEN_URI,
            authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
        },
        STRIPE: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
            STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL,
            STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL,
        },
        GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
    };
};
exports.envVar = loadEnvVariable();
