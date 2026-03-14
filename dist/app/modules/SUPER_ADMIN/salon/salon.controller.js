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
exports.salonController = void 0;
const salon_service_1 = require("./salon.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createSalon = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salon_service_1.salonService.createSalon(req.body, user);
    res.status(200).json({
        success: true,
        message: "Salon created successfully",
        data: result,
    });
}));
const getAllSalon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield salon_service_1.salonService.getAllSalon(query);
    res.status(200).json({
        success: true,
        meta: result.meta,
        data: result.allData,
    });
}));
const getSingleSalon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const { lat1, lon1 } = req.query;
    const result = yield salon_service_1.salonService.getSingleSalon(req.params.id, user, lat1, lon1);
    res.status(200).json({
        success: true,
        data: result,
    });
}));
const getSalonSetting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salon_service_1.salonService.getSalonSetting(user);
    res.status(200).json({
        success: true,
        data: result,
    });
}));
const updateSalon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `/image/${req.files.image[0].filename}`;
    }
    const user = req.user.userId;
    const result = yield salon_service_1.salonService.updateSalon(req.body, user);
    res.status(200).json({
        success: true,
        message: "Salon updated successfully",
        data: result,
    });
}));
const deleteSalon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    yield salon_service_1.salonService.deleteSalon(req.params.id, user);
    res.status(200).json({
        success: true,
        message: "Salon deleted successfully",
    });
}));
const visitConfirm = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const { lat1, lon1 } = req.query;
    if (!lat1 || !lon1) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Latitude and longitude are required");
    }
    const result = yield salon_service_1.salonService.visitConfirm(req.params.id, user, lat1, lon1);
    res.status(200).json({
        success: true,
        message: result.message
    });
}));
const salonMenagement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.userId;
    const result = yield salon_service_1.salonService.salonMenagement(user);
    res.status(200).json({
        success: true,
        data: result,
    });
}));
exports.salonController = {
    createSalon,
    getAllSalon,
    getSingleSalon,
    updateSalon,
    deleteSalon,
    visitConfirm,
    getSalonSetting,
    salonMenagement
};
