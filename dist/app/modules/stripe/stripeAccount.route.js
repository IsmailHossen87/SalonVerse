"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripeAccount_controller_1 = require("./stripeAccount.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middleware/checkAuth");
// import { auth } from "../../middlewares/auth.js";
const stripeAccountRoutes = (0, express_1.Router)();
stripeAccountRoutes.post('/connected-user/login-link', (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), stripeAccount_controller_1.stripeAccountController.stripeLoginLink);
stripeAccountRoutes
    .post('/create-connected-account', (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), stripeAccount_controller_1.stripeAccountController.createStripeAccount)
    .get('/success-account/:id', stripeAccount_controller_1.stripeAccountController.successPageAccount)
    .get('/refreshAccountConnect/:id', stripeAccount_controller_1.stripeAccountController.refreshAccountConnect);
stripeAccountRoutes.get('/success-account/:accountId', stripeAccount_controller_1.stripeAccountController.onConnectedStripeAccountSuccess);
exports.default = stripeAccountRoutes;
