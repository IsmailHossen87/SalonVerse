import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { USER_ROLE } from "../user/user.interface";

// notification.router.ts
const router = Router()
router.route("/")
    .get(checkAuth(USER_ROLE.USER, USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), NotificationController.getAllNotification)
router.route("/count")
    .get(checkAuth(USER_ROLE.USER, USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), NotificationController.getNotificationCount)
router.route("/:id")
    .get(checkAuth(USER_ROLE.USER, USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), NotificationController.getSingleNotification)
    .delete(checkAuth(USER_ROLE.USER, USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), NotificationController.deleteNotification)
// post(NotificationController.sendNotification)          //Notification send any Service


export const notificationRouter = router