"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const notification_model_1 = require("./notification.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// notification.service.ts
const sendNotification = (query) => __awaiter(void 0, void 0, void 0, function* () {
});
const getAllNotification = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(notification_model_1.NotificationModel.find({ receiverId: userId, isDeleted: false }), query)
        .sort()
        .paginate()
        .fields();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);
    return { data, meta };
});
const getSingleNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.NotificationModel.findById(id);
    if (!notification) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notification not found");
    }
    notification.read = true;
    yield notification.save();
    return notification;
});
const deleteNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.NotificationModel.findById(id);
    if (!notification) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notification not found");
    }
    notification.isDeleted = true;
    yield notification.save();
    return notification;
});
const getNotificationCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.NotificationModel.countDocuments({ receiverId: userId, isDeleted: false, read: false });
    if (!notification) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notification not found");
    }
    return notification;
});
exports.NotificationService = {
    sendNotification,
    getAllNotification,
    getSingleNotification,
    deleteNotification,
    getNotificationCount
};
