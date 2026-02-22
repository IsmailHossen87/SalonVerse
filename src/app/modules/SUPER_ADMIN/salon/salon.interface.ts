// salon.interface.ts
import { Types } from "mongoose";
import { IStatus } from "../../user/user.interface";

export enum SUBSCRIPTION_TYPE {
    BASIC = "basic",
    PREMIUM = "premium"
}

export interface ISalon {
    createdBy: Types.ObjectId;
    businessName: string;
    businessType: string; // salon, clinic etc
    city: string;
    salonId: string;

    subscriptionType: SUBSCRIPTION_TYPE;
    startDate: Date;
    expiryDate: Date;

    phone: string;
    email: string;

    activeStatus: IStatus
    admin?: Types.ObjectId;
}
