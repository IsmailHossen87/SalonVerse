"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRouter = void 0;
// referral.router.ts
const express_1 = require("express");
const referral_controller_1 = require("./referral.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.post("/my-referral-link", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), referral_controller_1.ReferralController.getMyReferralLink);
exports.ReferralRouter = router;
