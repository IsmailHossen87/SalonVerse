"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseNotificationBuilder = void 0;
const firebaseAdmin_1 = require("../middleware/firebaseAdmin");
const notification_model_1 = require("../modules/notification/notification.model");
// Event list for DB saving
const EVENTS_TO_SAVE = ['LOGIN', 'LOGOUT', 'MESSAGE', 'LIKE', 'COMMENT', 'FOLLOW', 'EVENT_REMINDER'];
// Main reusable notification function
const firebaseNotificationBuilder = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, title, body, receiverId, notificationEvent, notificationType, referenceId, referenceType, image = "", saveToDatabase = true }) {
    const promises = [];
    // 1️⃣ Send Firebase Notification
    if (user === null || user === void 0 ? void 0 : user.fcmToken) {
        const sound = user.isSoundNotificationEnabled ? "default" : undefined;
        promises.push(firebaseAdmin_1.firebaseAdmin.messaging().send({
            token: user.fcmToken,
            data: {
                title,
                body,
                notificationEvent: notificationEvent || '',
                notificationType: notificationType || '',
                referenceId: referenceId || '',
                referenceType: referenceType || '',
                image: image || '',
            },
            android: { priority: "high" },
            apns: {
                headers: { "apns-push-type": "alert", "apns-priority": "10" },
                payload: { aps: Object.assign({ alert: { title, body } }, (sound && { sound })) }
            }
        }));
    }
    // 2️⃣ Save to DB if event matches or saveToDatabase = true
    const shouldSave = saveToDatabase && (!notificationEvent || EVENTS_TO_SAVE.includes(notificationEvent));
    if (shouldSave) {
        promises.push(notification_model_1.NotificationModel.create({
            senderId: user._id,
            receiverId: receiverId || user._id,
            title,
            body,
            referenceType,
            referenceId,
            notificationType,
            notificationEvent,
            read: false
        }));
    }
    yield Promise.allSettled(promises);
});
exports.firebaseNotificationBuilder = firebaseNotificationBuilder;
