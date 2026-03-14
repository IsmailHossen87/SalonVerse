"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
// notification.router.ts
const router = (0, express_1.Router)();
router.route("/")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), notification_controller_1.NotificationController.getAllNotification);
router.route("/count")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), notification_controller_1.NotificationController.getNotificationCount);
router.route("/:id")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), notification_controller_1.NotificationController.getSingleNotification)
    .delete((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), notification_controller_1.NotificationController.deleteNotification);
// post(NotificationController.sendNotification)          //Notification send any Service
exports.notificationRouter = router;
