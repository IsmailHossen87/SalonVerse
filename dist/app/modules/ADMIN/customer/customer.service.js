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
exports.CustomerService = void 0;
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const reward_model_1 = require("../../reward/reward.model");
const user_interface_1 = require("../../user/user.interface");
const user_model_1 = require("../../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
// customer.service.ts
const getAllCustomer = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role !== user_interface_1.USER_ROLE.OWNER && user.role !== user_interface_1.USER_ROLE.SUPER_ADMIN)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    const totalUser = user_model_1.UserModel.find({ role: user_interface_1.USER_ROLE.USER }).select("name email image phoneNumber coins isOnline");
    const queryBuilder = new QueryBuilder_1.QueryBuilder(totalUser, query)
        .search(['name  phoneNumber'])
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
    const totalCustomer = yield user_model_1.UserModel.countDocuments({
        role: user_interface_1.USER_ROLE.USER
    });
    const activeCustomer = yield user_model_1.UserModel.countDocuments({
        role: user_interface_1.USER_ROLE.USER,
        isOnline: true
    });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const TodayIssued = yield reward_model_1.PointIssuedHistory.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: todayStart
                }
            }
        },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$points" }
            }
        }
    ]);
    const formattedUsers = data.map((u) => (Object.assign(Object.assign({}, u.toObject()), { name: u.name || "No Name", userId: u._id, phoneNumber: u.phoneNumber || "NO Number" })));
    return { meta, data: formattedUsers, dashboardData: { totalCustomer, activeCustomer, todayIssued: ((_a = TodayIssued[0]) === null || _a === void 0 ? void 0 : _a.totalPoints) || 0 } };
});
const getSingleUser = (userId, reqUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId).select("-auths").populate({ path: "invitedBy", select: "name image phoneNumber" });
    const userInfo = yield user_model_1.UserModel.findById(reqUser.userId);
    if (!userInfo)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (userInfo.role !== user_interface_1.USER_ROLE.OWNER && userInfo.role !== user_interface_1.USER_ROLE.SUPER_ADMIN)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    const totalVisit = yield reward_model_1.ViewReward.find({ userId: new mongoose_1.default.Types.ObjectId(userId) }).select("viewCount");
    const availableReward = yield reward_model_1.Reward.find({ userId: new mongoose_1.default.Types.ObjectId(userId), status: user_interface_1.IStatus.PENDING });
    return { user, totalVisit: totalVisit[0].viewCount || 0, availableReward };
});
// Approve Reward
const approvedReward = (userId, reqUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.UserModel.findById(reqUser.userId);
    if (!userInfo)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (userInfo.role !== user_interface_1.USER_ROLE.OWNER && userInfo.role !== user_interface_1.USER_ROLE.SUPER_ADMIN)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    const user = new mongoose_1.default.Types.ObjectId(userId);
    const reward = yield reward_model_1.Reward.findOne({ userId: user, status: user_interface_1.IStatus.PENDING });
    if (!reward)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    reward.status = user_interface_1.IStatus.APPROVED;
    const rewardOwnerUser = yield user_model_1.UserModel.findById(reward.userId);
    if (!rewardOwnerUser)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward owner not found");
    // if (rewardOwnerUser.fcmToken) {
    //     await firebaseNotificationBuilder({
    //         user: rewardOwnerUser,
    //         title: "You've successfully approved a reward",
    //         body: "You've successfully approved a reward",
    //         notificationEvent: INOTIFICATION_EVENT.APPROVE_REWARD,
    //         notificationType: INOTIFICATION_TYPE.NOTIFICATION,
    //         referenceId: userInfo._id,
    //         referenceType: "User"
    //     })
    // }
    yield reward.save();
    return reward;
});
exports.CustomerService = {
    getAllCustomer,
    getSingleUser,
    approvedReward
};
