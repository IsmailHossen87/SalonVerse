"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("./user.interface");
const fileUploadHandlare_1 = __importDefault(require("../../middleware/fileUploadHandlare"));
const parseFromData_1 = require("../../middleware/parseFromData");
// user.router.ts
const router = (0, express_1.Router)();
// ✅ নতুন route: OTP পাঠানো
router.post("/send-otp", user_controller_1.userController.sendOTP);
router.get("/coins", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), user_controller_1.userController.getUserCoins);
router
    .route("/")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), user_controller_1.userController.getAllUser)
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), (0, fileUploadHandlare_1.default)(), parseFromData_1.parseFormDataMiddleware, user_controller_1.userController.updateUser)
    .post((0, fileUploadHandlare_1.default)(), parseFromData_1.parseFormDataMiddleware, user_controller_1.userController.createUser);
router.route("/details").get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), user_controller_1.userController.userDetails);
router.route("/delete").delete((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER), user_controller_1.userController.deleteUser);
exports.userRouter = router;
