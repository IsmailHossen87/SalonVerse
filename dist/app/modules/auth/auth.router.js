"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
// auth.router.ts
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.loginCredential);
router.post("/login-admin", auth_controller_1.authController.loginSuperAdmin);
// 🔥 NEW: Google Authentication Route
router.post("/google-login", auth_controller_1.authController.googleLogin);
router.post("/refresh-token", auth_controller_1.authController.refreshToken);
router.post("/logout", auth_controller_1.authController.logout);
// ------------- OTP Send & Verify -------------
router.post("/send-otp", auth_controller_1.authController.sendOtp);
router.post("/verify-user", auth_controller_1.authController.userVerify);
router.post("/forget-password", auth_controller_1.authController.forgetPassword);
// ----------- 
router.post("/change-password", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), auth_controller_1.authController.changePassword);
exports.authRouter = router;
