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
exports.RuleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const rule_service_1 = require("./rule.service");
const globalRule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { platformName, supportEmail, passwordLength, ruleType } = req.body;
    const payload = {
        platformName,
        supportEmail,
        passwordLength,
        ruleType
    };
    const result = yield rule_service_1.RuleService.globalRule(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Content upserted successfully',
        data: result,
    });
}));
const smartRule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { everyVisitCoins, timeZoneStart, timeZoneEnd, timeZoneGetCoin, totalVist, totalVisitGetCoin, inviteEarCoin, ruleType } = req.body;
    const payload = {
        everyVisitCoins,
        timeZoneStart,
        timeZoneEnd,
        timeZoneGetCoin,
        totalVist,
        totalVisitGetCoin,
        inviteEarCoin,
        ruleType
    };
    const result = yield rule_service_1.RuleService.smartRule(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Content upserted successfully',
        data: result,
    });
}));
const rewardRule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tireName, tireCoins, tireLevel, ruleType } = req.body;
    const payload = {
        tireName,
        tireCoins,
        tireLevel,
        ruleType
    };
    if (!payload) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payload is required!');
    }
    const result = yield rule_service_1.RuleService.rewardRule(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Content upserted successfully',
        data: result,
    });
}));
const getRule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ruleType } = req.params;
    const result = yield rule_service_1.RuleService.getRule(ruleType);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Content upserted successfully',
        data: result,
    });
}));
const tireRule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { tireName, tireCoins } = req.body;
    const result = yield rule_service_1.RuleService.tireRule({ tireName, tireCoins }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Tire  created successfully',
        data: result,
    });
}));
const allTire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_service_1.RuleService.getTire();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Content upserted successfully',
        data: result,
    });
}));
exports.RuleController = {
    globalRule,
    smartRule,
    rewardRule,
    getRule,
    tireRule,
    allTire
};
