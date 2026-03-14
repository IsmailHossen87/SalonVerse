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
exports.NotificationController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const notification_service_1 = require("./notification.service");
// user.controller.ts
// const sendNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await NotificationService.sendNotification(req.body)
//     res.status(200).json({
//         success: true,
//         message: "User created successfully",
//         data: result
//     })
// })
// GET ALL NOTIFICATION
const getAllNotification = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield notification_service_1.NotificationService.getAllNotification(query, req.user.userId);
    res.status(200).json({
        success: true,
        message: "Notification retrived successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSingleNotification = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.getSingleNotification(req.params.id);
    res.status(200).json({
        success: true,
        message: "Notification retrived successfully",
        data: result
    });
}));
const deleteNotification = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.deleteNotification(req.params.id);
    res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
        data: result
    });
}));
const getNotificationCount = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.getNotificationCount(req.user.userId);
    res.status(200).json({
        success: true,
        message: "Notification count retrived successfully",
        data: result
    });
}));
exports.NotificationController = {
    // sendNotification,
    getAllNotification,
    getSingleNotification,
    deleteNotification,
    getNotificationCount
};
