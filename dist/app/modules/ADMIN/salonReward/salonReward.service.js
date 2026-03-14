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
exports.salonRewardService = void 0;
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const user_model_1 = require("../../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../../user/user.interface");
const salonReward_model_1 = require("./salonReward.model");
const salon_model_1 = require("../../SUPER_ADMIN/salon/salon.model");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const unLinkFile_1 = __importDefault(require("../../../shared/unLinkFile"));
const reward_model_1 = require("../../reward/reward.model");
const mongoose_1 = __importDefault(require("mongoose"));
const notification_interface_1 = require("../../notification/notification.interface");
const socketHelper_1 = require("../../../helpers/socketHelper");
// reward.service.ts
const createReward = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const salon = yield salon_model_1.SalonModel.findOne({ admin: user._id });
    if (!salon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
    }
    const reward = yield salonReward_model_1.RewardSalonModel.create(Object.assign(Object.assign({}, payload), { ownerId: user._id, salonId: salon._id }));
    return reward;
});
const getAllSalonReward = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { salons } = query, rest = __rest(query, ["salons"]);
    let mongoQuery = {};
    if (salons) {
        const salonIds = salons.split(",");
        mongoQuery.salonId = { $in: salonIds };
    }
    const reward = salonReward_model_1.RewardSalonModel.find(mongoQuery);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(reward, rest)
        .search(["rewardName", "service", "description", "redemptionPolicy", "rewardStatus"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);
    const salon = yield Promise.all(data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const salon = yield salon_model_1.SalonModel.findById(item.salonId);
        return Object.assign(Object.assign({}, item.toObject()), { openingTime: salon === null || salon === void 0 ? void 0 : salon.openingTime });
    })));
    const salonsWithClosedDays = salon.map((item) => {
        var _a;
        const closedDays = (_a = item.openingTime) === null || _a === void 0 ? void 0 : _a.filter((day) => day.isClosed === true);
        return Object.assign(Object.assign({}, item), { 
            // remove openingTime
            openingTime: undefined, closedDays });
    });
    return { data: salonsWithClosedDays, meta };
});
const globalReward = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const userViewReward = yield reward_model_1.ViewReward.find({ userId: userId });
    if (userViewReward.length === 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    }
    // Extract salonIds
    const salonIds = userViewReward.map(item => item.salonId).filter((id) => !!id);
    // Find salons in RewardSalonModel
    const reward = salonReward_model_1.RewardSalonModel.find({ salonId: { $in: salonIds } });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(reward, query)
        .search(["rewardName", "service", "description", "redemptionPolicy", "rewardStatus"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);
    const salon = yield Promise.all(data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const salon = yield salon_model_1.SalonModel.findById(item.salonId);
        return Object.assign(Object.assign({}, item.toObject()), { openingTime: salon === null || salon === void 0 ? void 0 : salon.openingTime });
    })));
    const salonsWithClosedDays = salon.map((item) => {
        var _a;
        const closedDays = (_a = item.openingTime) === null || _a === void 0 ? void 0 : _a.filter((day) => day.isClosed === true);
        return Object.assign(Object.assign({}, item), { 
            // remove openingTime
            openingTime: undefined, closedDays, VisitorCoin: user.coins });
    });
    return { data: salonsWithClosedDays, meta };
});
const getSingleSalonReward = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield salonReward_model_1.RewardSalonModel.findById(id);
    const visitorUser = yield user_model_1.UserModel.findById(userId);
    if (!visitorUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!reward) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    }
    return Object.assign(Object.assign({}, reward.toObject()), { VisitorCoin: (visitorUser === null || visitorUser === void 0 ? void 0 : visitorUser.coins) || 0 });
});
const updateSalonReward = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const rewardInfo = yield salonReward_model_1.RewardSalonModel.findById(id);
    if (!rewardInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    }
    if (payload.rewardImage && rewardInfo.rewardImage) {
        yield (0, unLinkFile_1.default)(rewardInfo.rewardImage);
    }
    const reward = yield salonReward_model_1.RewardSalonModel.findByIdAndUpdate(id, payload, { new: true });
    return reward;
});
const claimReward = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield salonReward_model_1.RewardSalonModel.findById(id);
    if (!reward)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    const visitorUser = yield user_model_1.UserModel.findById(userId);
    const admin = yield user_model_1.UserModel.findOne({ _id: new mongoose_1.default.Types.ObjectId(reward.ownerId) });
    if (!admin)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    if (!visitorUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    yield reward_model_1.PurchaseReward.create({
        rewardId: reward._id,
        userId: visitorUser._id,
        salonId: reward.salonId,
        pointCost: reward.rewardPoints
    });
    if (Number(reward === null || reward === void 0 ? void 0 : reward.rewardPoints) > Number(visitorUser === null || visitorUser === void 0 ? void 0 : visitorUser.coins)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You don't have enough coins to claim this reward");
    }
    yield user_model_1.UserModel.findByIdAndUpdate(visitorUser._id, {
        $inc: { coins: -reward.rewardPoints }
    });
    // realtime notification
    socketHelper_1.socketHelper.emit("notification", {
        receiver: visitorUser._id,
        title: "Reward Claimed",
        message: `${reward.rewardName} claimed successfully`,
        type: "INVITE_REWARD",
    });
    yield (0, socketHelper_1.saveNotification)({
        receiverId: visitorUser._id,
        title: "Reward Claimed",
        body: `${reward.rewardName} claimed successfully`,
        notificationEvent: notification_interface_1.INOTIFICATION_EVENT.PURCHASE_REWARD,
        notificationType: notification_interface_1.INOTIFICATION_TYPE.NOTIFICATION,
        referenceId: visitorUser._id,
        referenceType: notification_interface_1.IREFERENCE_TYPE.USER,
        read: false,
    });
    return `${reward.rewardName} claimed successfully`;
});
// RDDEMPTION 
const getAllRedemption = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { phone, rewardName } = query, rest = __rest(query, ["phone", "rewardName"]);
    let mongoQuery = {};
    if (phone) {
        const user = yield user_model_1.UserModel.findOne({ phoneNumber: phone });
        if (!user)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        mongoQuery.userId = user._id;
    }
    if (rewardName) {
        const reward = yield salonReward_model_1.RewardSalonModel.findOne({ rewardName: rewardName });
        if (reward) {
            mongoQuery.rewardId = reward._id;
        }
    }
    const reward = reward_model_1.PurchaseReward.find(mongoQuery).populate({ path: "rewardId", select: "rewardName rewardPoints" }).populate({ path: "userId", select: "phoneNumber" });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(reward, rest)
        .search(["status"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);
    if (data.length < 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No data found");
    }
    const result = data.map((item) => {
        return {
            _id: item._id,
            rewardName: item.rewardId.rewardName,
            rewardPoints: item.rewardId.rewardPoints,
            phoneNumber: item.userId.phoneNumber,
            status: item.status,
            createdAt: item.createdAt,
        };
    });
    const coundPending = yield reward_model_1.PurchaseReward.countDocuments({ status: user_interface_1.IStatus.PENDING });
    const coundApproved = yield reward_model_1.PurchaseReward.countDocuments({ status: user_interface_1.IStatus.APPROVED });
    const coundRejected = yield reward_model_1.PurchaseReward.countDocuments({ status: user_interface_1.IStatus.REJECTED });
    const totalPointReedem = yield reward_model_1.PurchaseReward.aggregate([
        {
            $match: { status: user_interface_1.IStatus.APPROVED }
        },
        {
            $lookup: {
                from: "rewardsalons",
                localField: "rewardId",
                foreignField: "_id",
                as: "rewardId"
            }
        },
        {
            $unwind: "$rewardId"
        },
        {
            $group: {
                _id: null,
                totalPointReedem: { $sum: "$rewardId.rewardPoints" }
            }
        }
    ]);
    return {
        data: result,
        meta,
        statusCount: {
            pending: coundPending,
            approved: coundApproved,
            rejected: coundRejected,
            totalPointReedem: ((_a = totalPointReedem[0]) === null || _a === void 0 ? void 0 : _a.totalPointReedem) || 0
        }
    };
});
const approveRedemption = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield reward_model_1.PurchaseReward.findById(id);
    if (!reward)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    const rewardInfo = yield salonReward_model_1.RewardSalonModel.findById(reward === null || reward === void 0 ? void 0 : reward.rewardId);
    if ((rewardInfo === null || rewardInfo === void 0 ? void 0 : rewardInfo.ownerId.toString()) !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    let status = "";
    if (reward.status === user_interface_1.IStatus.PENDING) {
        status = user_interface_1.IStatus.APPROVED;
    }
    else if (reward.status === user_interface_1.IStatus.APPROVED) {
        status = user_interface_1.IStatus.REJECTED;
    }
    else {
        status = user_interface_1.IStatus.APPROVED;
    }
    yield reward_model_1.PurchaseReward.findByIdAndUpdate(id, { status });
    if (status === user_interface_1.IStatus.APPROVED) {
        yield user_model_1.UserModel.findByIdAndUpdate(reward.userId, {
            $inc: { coins: rewardInfo.rewardPoints }
        });
    }
    else if (status === user_interface_1.IStatus.REJECTED) {
        yield user_model_1.UserModel.findByIdAndUpdate(reward.userId, {
            $inc: { coins: -rewardInfo.rewardPoints }
        });
    }
    const user = yield user_model_1.UserModel.findById(reward.userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    socketHelper_1.socketHelper.emit("notification", {
        receiver: user._id.toString(),
        title: "Approved Reward",
        message: `You've successfully claimed a reward ${rewardInfo.rewardPoints} coins`,
        type: "VISIT_REWARD",
    });
    return `Reward ${status} successfully`;
});
const getPurchaseRewardHistory = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const matchQuery = { userId: new mongoose_1.default.Types.ObjectId(userId) };
    if (query.searchTerm) {
        const matchingSalons = yield salon_model_1.SalonModel.find({
            businessName: { $regex: query.searchTerm, $options: "i" }
        }).select("_id");
        const salonIds = matchingSalons.map((s) => s._id);
        matchQuery.salonId = { $in: salonIds };
    }
    const reward = reward_model_1.PurchaseReward.find(matchQuery).populate({ path: "salonId", select: "businessName service" }).lean();
    if (!reward)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reward not found");
    const queryBuilder = new QueryBuilder_1.QueryBuilder(reward, query).search([]).filter().sort();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);
    const total = yield reward_model_1.PurchaseReward.aggregate([
        {
            $match: { userId: new mongoose_1.default.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: null,
                totalPointReedem: { $sum: "$pointCost" }
            }
        }
    ]);
    return { meta, reward: data, totalPointReedem: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.totalPointReedem) || 0 };
    // return reward
});
const getViewHistory = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield reward_model_1.PointIssuedHistory.find({
        salonId: new mongoose_1.default.Types.ObjectId(id),
        userId: new mongoose_1.default.Types.ObjectId(userId)
    })
        .populate({ path: "userId", select: "phoneNumber" })
        .populate({ path: "salonId", select: "businessName location service" });
    let salonData = null;
    if (reward.length === 0) {
        const salon = yield salon_model_1.SalonModel.findById(id).select("businessName location service");
        if (!salon)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
        salonData = salon;
    }
    else {
        salonData = reward[0].salonId;
    }
    // Salon info (only once)
    const salon = {
        businessName: (salonData === null || salonData === void 0 ? void 0 : salonData.businessName) || '',
        location: (salonData === null || salonData === void 0 ? void 0 : salonData.location) || '',
        service: (salonData === null || salonData === void 0 ? void 0 : salonData.service) || ''
    };
    // History list
    const history = reward.map((item) => ({
        _id: item._id,
        points: (item === null || item === void 0 ? void 0 : item.points) || 0,
        createdAt: item === null || item === void 0 ? void 0 : item.createdAt
    }));
    return {
        salon,
        history
    };
});
exports.salonRewardService = {
    createReward,
    getAllSalonReward,
    getSingleSalonReward,
    updateSalonReward,
    claimReward,
    approveRedemption,
    getAllRedemption,
    globalReward,
    getPurchaseRewardHistory,
    getViewHistory
};
