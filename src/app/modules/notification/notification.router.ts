import { Router } from "express";
import { NotificationController } from "./notification.controller";

// notification.router.ts
const router = Router()
router.route("/")
    .get(NotificationController.getAllNotification)
// post(NotificationController.sendNotification)          //Notification send any Service


export const notificationRouter = router