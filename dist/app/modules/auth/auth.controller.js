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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const setCookie_1 = require("../../utils/setCookie");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
// user.controller.ts
const loginCredential = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.loginCredential(req.body);
    (0, setCookie_1.setAuthCookie)(res, { refreshToken: result.refreshToken }); //IF USE set cookie
    res.status(200).json({
        success: true,
        message: "User Login successfully",
        data: result
    });
}));
const loginSuperAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.loginSuperAdmin(req.body);
    (0, setCookie_1.setAuthCookie)(res, { refreshToken: result.refreshToken }); //IF USE set cookie
    res.status(200).json({
        success: true,
        message: "User Login successfully",
        data: Object.assign({}, result)
    });
}));
// 🔥🔥🔥🔥 Google Login
const googleLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "ID Token is required");
    }
    const result = yield auth_service_1.authService.googleLogin(idToken);
    (0, setCookie_1.setAuthCookie)(res, { refreshToken: result.refreshToken });
    res.status(200).json({
        success: true,
        message: result.isNewUser ? "Account created successfully" : "Login successful",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        }
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.refreshToken(req.body);
    res.status(200).json({
        success: true,
        message: "User Login successfully",
        accessToken: result.accessToken
    });
}));
const logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.logout(req.body);
    // res.clearCookie("refreshToken", {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "lax"
    // });
    res.status(200).json({
        success: true,
        message: "User Logout successfully",
        data: result
    });
}));
const sendOtp = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.authService.sendOtp(email);
    res.status(200).json({
        success: true,
        message: "OTP send successfully",
        data: result
    });
}));
const userVerify = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.userVerify(req.body);
    res.status(200).json({
        success: true,
        message: "User Verify successfully",
        data: result
    });
}));
const forgetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, hash, otp, password } = req.body;
    yield auth_service_1.authService.forgetPassword({ email, hash, otp, password });
    res.status(200).json({
        success: true,
        message: "Password Reset successfully",
        data: null
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const result = yield auth_service_1.authService.changePassword({ oldPassword, newPassword, user });
    res.status(200).json({
        success: true,
        message: result.message,
    });
}));
exports.authController = {
    loginCredential,
    loginSuperAdmin,
    refreshToken,
    logout,
    sendOtp,
    userVerify,
    forgetPassword,
    changePassword,
    googleLogin
};
