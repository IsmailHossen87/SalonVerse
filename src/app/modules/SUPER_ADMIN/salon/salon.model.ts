// salon.model.ts
import { Schema, model } from "mongoose";
import { IDay, IOpeningTime, ISalon, SUBSCRIPTION_TYPE } from "./salon.interface";
import { IStatus } from "../../user/user.interface";

const openingTimeSchema = new Schema<IOpeningTime>(
    {
        day: { type: String, enum: Object.values(IDay) },
        openingTime: { type: String },
        closingTime: { type: String },
        isClosed: { type: Boolean, default: false },
    }
);

const salonSchema = new Schema<ISalon>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        admin: {
            type: Schema.Types.ObjectId, ref: "User",

        },
        businessName: { type: String, required: true, },
        city: { type: String, required: true, },
        subscriptionType: { type: String, enum: Object.values(SUBSCRIPTION_TYPE), required: true, },
        startDate: { type: Date, required: true, },
        expiryDate: { type: Date, required: true, },
        salonId: { type: String, required: true, unique: true },
        phone: { type: String, required: true, },
        email: { type: String, required: true, },
        activeStatus: { type: String, enum: Object.values(IStatus), default: IStatus.ACTIVE, },
        service: { type: String, },
        image: { type: String },
        location: { type: String },
        description: { type: String },
        openingTime: { type: [openingTimeSchema] },
    },
    {
        timestamps: true,
    }
);

const customerVisitorSchema = new Schema({
    salon: { type: Schema.Types.ObjectId, ref: "Salon", required: true, },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    visitDate: { type: Date, required: true, },
    visitTime: { type: String, required: true, },
});

export const CustomerVisitorModel = model("CustomerVisitor", customerVisitorSchema);

export const SalonModel = model<ISalon>("Salon", salonSchema);
