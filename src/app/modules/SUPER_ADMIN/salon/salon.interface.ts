// salon.interface.ts
import { Types } from "mongoose";
import { IStatus } from "../../user/user.interface";

export enum SUBSCRIPTION_TYPE {
    BASIC = "basic",
    PREMIUM = "premium"
}
export enum IDay {
    SUNDAY = "sunday",
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday"
}
export interface IOpeningTime {
    day: IDay;
    openingTime: string;
    closingTime: string;
    isClosed: boolean;
}

export interface ISalon {
    createdBy: Types.ObjectId;
    businessName: string;
    city: string;
    salonId: string;

    subscriptionType: SUBSCRIPTION_TYPE;
    startDate: Date;
    expiryDate: Date;
    // OWNER SET data
    image: string;
    location: string;
    service: string;
    description: string;
    openingTime: IOpeningTime[];


    phone: string;
    email: string;

    activeStatus: IStatus
    admin?: Types.ObjectId;
}
