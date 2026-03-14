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
exports.RewardService = void 0;
const reward_model_1 = require("./reward.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getActiveInviteReward = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield reward_model_1.Reward.findOne({
        userId,
        type: "INVITE",
        isUsed: false,
        expiresAt: { $gt: new Date() },
    });
});
const applyReward = (rewardId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield reward_model_1.Reward.findById(rewardId);
    if (!reward) {
        throw new Error("Reward not found");
    }
    if (reward.isUsed) {
        throw new Error("Reward already used");
    }
    reward.isUsed = true;
    yield reward.save();
    return { message: "Reward applied successfully" };
});
// USER SEE THEIR ACITVE REWARD
const activeReward = (userId, type, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role !== user_interface_1.USER_ROLE.USER && user.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only user can see their data");
    }
    // Decide status based on type
    const status = type === "active" ? user_interface_1.IStatus.PENDING : user_interface_1.IStatus.APPROVED;
    const queryBuilder = reward_model_1.PurchaseReward.find({
        userId: user._id,
        status
    })
        .populate({ path: "userId", select: "name phoneNumber coins" })
        .populate({ path: "salonId", select: "businessName service image" })
        .populate({ path: "rewardId", select: "rewardPoints rewardName rewardImage " }).sort({ createdAt: -1 });
    const result = new QueryBuilder_1.QueryBuilder(queryBuilder, query).paginate().sort().search([]).filter();
    const [meta, data] = yield Promise.all([
        result.getMeta(),
        result.build()
    ]);
    if (!data) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No data found");
    }
    const rewards = yield reward_model_1.Reward.find({
        userId: user._id,
        status
    });
    const rewardData = rewards.length > 0 ? rewards : [];
    return {
        meta, data: {
            purchases: Array.isArray(data) ? data : [],
            rewards: rewardData
        }
    };
});
const showAllReward = (userId, type, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role !== user_interface_1.USER_ROLE.USER && user.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only user can see their data");
    }
    // Decide status based on type
    const status = type === "active" ? user_interface_1.IStatus.PENDING : user_interface_1.IStatus.APPROVED;
    const queryBuilder = reward_model_1.PurchaseReward.find({
        userId: user._id,
        status
    })
        .populate({ path: "userId", select: "name phoneNumber coins" })
        .populate({ path: "salonId", select: "businessName service image" })
        .populate({ path: "rewardId", select: "rewardPoints rewardName rewardImage " }).sort({ createdAt: -1 });
    const result = new QueryBuilder_1.QueryBuilder(queryBuilder, query).paginate().sort().search([]).filter();
    const [meta, data] = yield Promise.all([
        result.getMeta(),
        result.build()
    ]);
    if (!data) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No data found");
    }
    const rewards = yield reward_model_1.Reward.find({
        userId: user._id,
        status
    });
    const rewardData = rewards.length > 0 ? rewards : [];
    return {
        meta, data: {
            // purchases: Array.isArray(data) ? data : [],
            rewards: rewardData
        }
    };
});
exports.RewardService = {
    getActiveInviteReward,
    applyReward,
    activeReward,
    showAllReward
};
