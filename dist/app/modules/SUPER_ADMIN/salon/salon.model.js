"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonModel = void 0;
// salon.model.ts
const mongoose_1 = require("mongoose");
const salon_interface_1 = require("./salon.interface");
const user_interface_1 = require("../../user/user.interface");
const openingTimeSchema = new mongoose_1.Schema({
    day: { type: String, enum: Object.values(salon_interface_1.IDay) },
    openingTime: { type: String },
    closingTime: { type: String },
    isClosed: { type: Boolean, default: false },
});
const salonSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User",
    },
    businessName: { type: String, required: true, },
    city: { type: String, required: true, },
    subscriptionType: { type: String, enum: Object.values(salon_interface_1.SUBSCRIPTION_TYPE), required: true, },
    startDate: { type: Date, required: true, },
    expiryDate: { type: Date, required: true, },
    salonId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, },
    email: { type: String, required: true, },
    activeStatus: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.ACTIVE, },
    service: { type: String, },
    image: { type: String },
    location: { type: String },
    lat: { type: String },
    lon: { type: String },
    description: { type: String },
    openingTime: { type: [openingTimeSchema] },
}, {
    timestamps: true,
});
// const customerVisitorSchema = new Schema({
//     salon: { type: Schema.Types.ObjectId, ref: "Salon", required: true, },
//     customer: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//     visitDate: { type: Date, required: true, },
//     visitTime: { type: String, required: true, },
//     viewCount: { type: Number, default: 0 },
//     lastVisitAt: { type: Date },
// });
// export const CustomerVisitorModel = model("CustomerVisitor", customerVisitorSchema);
exports.SalonModel = (0, mongoose_1.model)("Salon", salonSchema);
