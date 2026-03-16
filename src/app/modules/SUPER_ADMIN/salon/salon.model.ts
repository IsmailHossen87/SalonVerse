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
        lat: { type: String },
        lon: { type: String },
        description: { type: String },
        openingTime: { type: [openingTimeSchema] },
        totalReviews: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const ratingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true, },
    rating: { type: Number, default: 0, max: 5 },
    comment: { type: String },
})

export const RatingModel = model("Rating", ratingSchema);

export const SalonModel = model<ISalon>("Salon", salonSchema);
