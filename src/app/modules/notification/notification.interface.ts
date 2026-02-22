// notification.interface.ts
import { Types } from "mongoose";


export enum INOTIFICATION_EVENT {
    LOGIN = 'LOGIN',
}

export enum INOTIFICATION_TYPE {
    NOTIFICATION = 'NOTIFICATION',
    MESSAGE = 'MESSAGE',
}
export enum IREFERENCE_TYPE {
    CAR = 'CAR',
    ITEM = 'ITEM',
    USER = 'USER',
}
// notification.interface.ts
export interface INotification {
    user: any
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    title?: string;
    body: string;
    image?: string;
    chatId?: string;
    eventId?: string;
    type?: string;
    avatar?: string;
    read: boolean;
    notificationEvent?: INOTIFICATION_EVENT | string;
    notificationType?: INOTIFICATION_TYPE | string;
    referenceType?: IREFERENCE_TYPE | string;
    referenceId?: Types.ObjectId | string;
    status?: 'success' | 'rejected' | string;
}