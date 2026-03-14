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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitService = void 0;
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const reward_model_1 = require("../../reward/reward.model");
const user_model_1 = require("../../user/user.model");
const salon_model_1 = require("../../SUPER_ADMIN/salon/salon.model");
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../../user/user.interface");
const notification_interface_1 = require("../../notification/notification.interface");
const socketHelper_1 = require("../../../helpers/socketHelper");
// visit.service.ts
const getAllVisitRecord = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, salonId } = query, rest = __rest(query, ["userId", "salonId"]);
    const mongoQuery = {};
    if (userId) {
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        mongoQuery.userId = user._id;
    }
    if (salonId) {
        const salon = yield salon_model_1.SalonModel.findById(salonId);
        if (!salon) {
            throw new Error("Salon not found");
        }
        mongoQuery.salonId = salon._id;
    }
    const result = reward_model_1.ViewReward.find(mongoQuery).populate("userId", "name  phoneNumber").populate("salonId", "service businessName location").sort({ updatedAt: -1 });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(result, rest)
        .search(['name'])
        .filter()
        .limit()
        .paginate();
    const [meta, data] = yield Promise.all([
        queryBuilder.getMeta(),
        queryBuilder.build(),
    ]);
    if (data.length === 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No visit history found");
    }
    console.log(data);
    const resultData = data === null || data === void 0 ? void 0 : data.map((item) => {
        return {
            user: item.userId.name || 'N/A',
            userId: item.userId._id,
            rewardId: item._id,
            lastView: item.lastVisitAt,
            totalVisit: item.totalVisit,
            salonName: item.salonId.businessName,
            location: item.salonId.location,
            totalPoint: item.pendingCoins,
            serviceName: item.salonId.service,
            status: item.status,
        };
    });
    return { meta, data: resultData };
});
const approveVisitCoin = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const visit = yield reward_model_1.ViewReward.findById(id);
    if (!visit)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Visit not found");
    const rewardOwner = yield user_model_1.UserModel.findById(visit.userId);
    if (!rewardOwner)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward owner not found");
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not Owner");
    }
    let status = '';
    if (visit.status === user_interface_1.IStatus.PENDING) {
        status = user_interface_1.IStatus.APPROVED;
        yield rewardOwner.updateOne({ $inc: { coins: visit.pendingCoins } });
        yield visit.updateOne({ pendingCoins: 0 });
    }
    yield visit.updateOne({ status });
    // realtime notification for admin
    socketHelper_1.socketHelper.emit("notification", {
        receiver: rewardOwner._id,
        title: "Reward Claimed",
        message: `${visit.pendingCoins} claimed successfully`,
        type: "INVITE_REWARD",
    });
    yield (0, socketHelper_1.saveNotification)({
        receiverId: rewardOwner._id,
        title: "View Reward Claimed",
        body: `${visit.pendingCoins} claimed successfully`,
        notificationEvent: notification_interface_1.INOTIFICATION_EVENT.PURCHASE_REWARD,
        notificationType: notification_interface_1.INOTIFICATION_TYPE.NOTIFICATION,
        referenceId: visit._id,
        referenceType: notification_interface_1.IREFERENCE_TYPE.USER,
        read: false,
    });
    return visit;
});
exports.VisitService = {
    getAllVisitRecord,
    approveVisitCoin
};
