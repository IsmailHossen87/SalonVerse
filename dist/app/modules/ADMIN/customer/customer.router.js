"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../../middleware/checkAuth");
const user_interface_1 = require("../../user/user.interface");
const customer_controller_1 = require("./customer.controller");
// customer.router.ts
const router = (0, express_1.Router)();
router.route("/")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), customer_controller_1.CustomerController.getAllCustomer);
router.route("/:id")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER), customer_controller_1.CustomerController.singleUser);
router.route("/approved-reward/:id")
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), customer_controller_1.CustomerController.approvedReward);
exports.CustomerRoutes = router;
