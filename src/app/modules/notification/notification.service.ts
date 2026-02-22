import { saveNotification } from "../../shared/sendNotification"
import { NOTIFICATION_TYPE } from "./notification.interface";

// notification.service.ts
const sendNotification = async (payload: any) => {

}
// NOTIFICATION 🔔🔔🔔
// sendReaujableNotification({
//     fcmToken: carOwner?.fcmToken,
//     title: "Car Status Changed",
//     body: "Your car status has been changed to",
//     type: NOTIFICATION_TYPE.CAR_APPROVED,
//     carId: carId,
//     senderId: userId,
//     receiverId: carOwner?.id,
//     image: CarInfo?.images[0],
// })




// const valueForNotification = {
//     title: "Car Status Changed",
//     body: "Your car status has been changed to",
//     type: NOTIFICATION_TYPE.CAR_APPROVED,
//     notificationType: "NOTIFICATION",
//     status: "SUCCESS",
//     senderId: "",
//     receiverId: "",
// }
// saveNotification(valueForNotification)


const getAllNotification = async () => {
    return
}
export const NotificationService = {
    sendNotification,
    getAllNotification
}