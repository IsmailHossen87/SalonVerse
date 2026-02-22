import { firebaseAdmin } from "../middleware/firebaseAdmin";
import { NotificationModel } from "../modules/notification/notification.model";

// Event list for DB saving
const EVENTS_TO_SAVE = ['LOGIN', 'LOGOUT', 'MESSAGE', 'LIKE', 'COMMENT', 'FOLLOW', 'EVENT_REMINDER'];

// Notification payload interface
interface NotificationPayload {
    user: any;
    title: string;
    body: string;
    receiverId?: string;
    notificationEvent?: string;
    notificationType?: string;
    referenceId?: string;
    referenceType?: string;
    image?: string;
    saveToDatabase?: boolean; // optional
}

// Main reusable notification function
export const firebaseNotificationBuilder = async ({
    user,
    title,
    body,
    receiverId,
    notificationEvent,
    notificationType,
    referenceId,
    referenceType,
    image = "",
    saveToDatabase = true
}: NotificationPayload) => {

    const promises = [];

    // 1️⃣ Send Firebase Notification
    if (user?.fcmToken) {
        const sound = user.isSoundNotificationEnabled ? "default" : undefined;
        promises.push(firebaseAdmin.messaging().send({
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
                payload: { aps: { alert: { title, body }, ...(sound && { sound }) } }
            }
        }));
    }



    // 2️⃣ Save to DB if event matches or saveToDatabase = true
    const shouldSave = saveToDatabase && (!notificationEvent || EVENTS_TO_SAVE.includes(notificationEvent));
    if (shouldSave) {
        promises.push(NotificationModel.create({
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

    await Promise.allSettled(promises);
};
