// notification.model.ts
import mongoose from "mongoose";
import { INOTIFICATION_EVENT, INOTIFICATION_TYPE, IREFERENCE_TYPE } from "./notification.interface";


// notification.model.ts
const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, },
    body: { type: String, required: true, },
    referenceType: { type: String, enum: Object.values(IREFERENCE_TYPE), required: true, },
    referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: "referenceType", required: true, },
    notificationType: { type: String, enum: Object.values(INOTIFICATION_TYPE) },
    notificationEvent: { type: String, enum: Object.values(INOTIFICATION_EVENT) },
    read: { type: Boolean, default: false, },
    status: { type: String, enum: ['success', 'rejected'], default: 'success', },
})

export const NotificationModel = mongoose.model("NotificationModel", notificationSchema)

