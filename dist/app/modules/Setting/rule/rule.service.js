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
exports.RuleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const rule_interface_1 = require("./rule.interface");
const rule_model_1 = require("./rule.model");
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const user_model_1 = require("../../user/user.model");
const user_interface_1 = require("../../user/user.interface");
const globalRule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOneAndUpdate({ ruleType: rule_interface_1.RuleType.GLOBAL_RULE }, Object.assign(Object.assign({}, payload), { ruleType: rule_interface_1.RuleType.GLOBAL_RULE }), { upsert: true, new: true });
    return result;
});
const smartRule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOneAndUpdate({ ruleType: rule_interface_1.RuleType.SMART_RULE }, Object.assign(Object.assign({}, payload), { ruleType: rule_interface_1.RuleType.SMART_RULE }), { upsert: true, new: true });
    return result;
});
const rewardRule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOneAndUpdate({ ruleType: rule_interface_1.RuleType.REWARD_RULE }, Object.assign(Object.assign({}, payload), { ruleType: rule_interface_1.RuleType.REWARD_RULE }), { upsert: true, new: true });
    return result;
});
const getRule = (ruleType) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOne({ ruleType });
    return result;
});
const tireRule = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload, userId);
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.role !== user_interface_1.USER_ROLE.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to create tire");
    }
    const checkTire = yield rule_model_1.Tire.findOne({ tireName: payload.tireName });
    if (checkTire) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tire already exists");
    }
    const createTire = yield rule_model_1.Tire.create(Object.assign({ userId }, payload));
    return createTire;
});
const getTire = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Tire.find();
    if (result.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tire not found");
    }
    return result;
});
exports.RuleService = {
    globalRule,
    smartRule,
    rewardRule,
    getRule,
    tireRule,
    getTire
};
