"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const express_1 = require("express");
const user_interface_1 = require("../../user/user.interface");
const dashboard_controller_1 = require("./dashboard.controller");
const checkAuth_1 = require("../../../middleware/checkAuth");
// dashboard.router.ts
const router = (0, express_1.Router)();
router.route("/").
    get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), dashboard_controller_1.DashboardController.getDashboard);
exports.DashboardRouter = router;
