"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
// notification.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const notification_interface_1 = require("./notification.interface");
// notification.model.ts
const notificationSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, },
    body: { type: String, required: true, },
    referenceType: { type: String, enum: Object.values(notification_interface_1.IREFERENCE_TYPE) },
    referenceId: { type: mongoose_1.default.Schema.Types.ObjectId, refPath: "referenceType" },
    notificationType: { type: String, enum: Object.values(notification_interface_1.INOTIFICATION_TYPE) },
    notificationEvent: { type: String, enum: Object.values(notification_interface_1.INOTIFICATION_EVENT) },
    read: { type: Boolean, default: false, },
    isDeleted: { type: Boolean, default: false, },
    status: { type: String, enum: ['success', 'rejected'], default: 'success', },
}, {
    timestamps: true,
    versionKey: false
});
exports.NotificationModel = mongoose_1.default.model("NotificationModel", notificationSchema);
