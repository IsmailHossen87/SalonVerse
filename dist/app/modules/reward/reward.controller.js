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
exports.RewardConroller = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const reward_service_1 = require("./reward.service");
const activeReward = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    const query = req.query;
    const result = yield reward_service_1.RewardService.activeReward(req.user.userId, type, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Get ${type} retrived Reward`,
        meta: result.meta,
        data: {
            purchases: result.data.purchases,
            rewards: result.data.rewards
        },
    });
}));
const showAllReward = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    const query = req.query;
    const result = yield reward_service_1.RewardService.showAllReward(req.params.id, type, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Get ${type} retrived Reward`,
        meta: result.meta,
        data: {
            // purchases: result.data.purchases,
            rewards: result.data.rewards
        },
    });
}));
exports.RewardConroller = {
    activeReward,
    showAllReward
};
