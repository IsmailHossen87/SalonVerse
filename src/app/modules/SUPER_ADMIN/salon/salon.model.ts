// salon.model.ts
import { Schema, model } from "mongoose";
import { ISalon, SUBSCRIPTION_TYPE } from "./salon.interface";
import { IStatus } from "../../user/user.interface";

const salonSchema = new Schema<ISalon>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        admin: {
            type: Schema.Types.ObjectId, ref: "User",

        },
        businessName: { type: String, required: true, },
        businessType: { type: String, required: true, },
        city: { type: String, required: true, },
        subscriptionType: { type: String, enum: Object.values(SUBSCRIPTION_TYPE), required: true, },
        startDate: { type: Date, required: true, },
        expiryDate: { type: Date, required: true, },
        salonId: { type: String, required: true, unique: true },
        phone: { type: String, required: true, },
        email: { type: String, required: true, },
        activeStatus: { type: String, enum: Object.values(IStatus), default: IStatus.ACTIVE, },
    },
    {
        timestamps: true,
    }
);

const customerVisitorSchema = new Schema({
    salon: { type: Schema.Types.ObjectId, ref: "Salon", required: true, },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    pointIssued: { type: Number, required: true, default: 0 },
    pointSpent: { type: Number, required: true, default: 0 },
    visitDate: { type: Date, required: true, },
    visitTime: { type: String, required: true, },
});

export const CustomerVisitorModel = model("CustomerVisitor", customerVisitorSchema);

export const SalonModel = model<ISalon>("Salon", salonSchema);
