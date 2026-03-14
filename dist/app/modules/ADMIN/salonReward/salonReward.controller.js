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
exports.salonRewardController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const salonReward_service_1 = require("./salonReward.service");
const createSalonReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.rewardImage = `/image/${req.files.image[0].filename}`;
    }
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.createReward(req.body, user);
    res.status(200).json({
        success: true,
        message: "Reward created successfully",
        data: result,
    });
}));
const getAllSalonReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield salonReward_service_1.salonRewardService.getAllSalonReward(req.query);
    res.status(200).json({
        success: true,
        message: "All salon rewards fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleSalonReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.getSingleSalonReward(req.params.id, user);
    res.status(200).json({
        success: true,
        message: "Salon reward fetched successfully",
        data: result,
    });
}));
const updateSalonReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.rewardImage = `/image/${req.files.image[0].filename}`;
    }
    const result = yield salonReward_service_1.salonRewardService.updateSalonReward(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Salon reward updated successfully",
        data: result,
    });
}));
// 🛄🛄🛄 clain reward
const claimReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.claimReward(req.params.id, user);
    res.status(200).json({
        success: true,
        message: result,
    });
}));
const globalReward = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const query = req.query;
    const result = yield salonReward_service_1.salonRewardService.globalReward(user, query);
    res.status(200).json({
        success: true,
        message: "Global reward created successfully",
        data: result.data,
        meta: result.meta,
    });
}));
// 🛄🛄🛄 clain reward
const approveRedemption = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.approveRedemption(req.params.id, user);
    res.status(200).json({
        success: true,
        message: "Approved redemption successfully",
        data: result,
    });
}));
const getAllRedemption = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.getAllRedemption(req.query, user);
    res.status(200).json({
        success: true,
        message: "All Purchase rewards fetched successfully",
        meta: result.meta,
        statusCount: result.statusCount,
        data: result.data,
    });
}));
const getPurchaseRewardHistory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const query = req.query;
    const result = yield salonReward_service_1.salonRewardService.getPurchaseRewardHistory(user, query);
    res.status(200).json({
        success: true,
        message: "Purchase reward history fetched successfully",
        meta: result.meta,
        data: {
            Reward: result.reward,
            TotalRedeemtion: result.totalPointReedem
        },
    });
}));
const getViewHistory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salonReward_service_1.salonRewardService.getViewHistory(req.params.id, user);
    res.status(200).json({
        success: true,
        message: "View history fetched successfully",
        data: result,
    });
}));
exports.salonRewardController = {
    createSalonReward,
    getAllSalonReward,
    getSingleSalonReward,
    updateSalonReward,
    claimReward,
    globalReward,
    approveRedemption,
    getAllRedemption,
    getPurchaseRewardHistory,
    getViewHistory
};
