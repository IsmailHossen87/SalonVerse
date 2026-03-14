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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// ✅ নতুন: OTP পাঠানো
const sendOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    const result = yield user_service_1.userService.sendRegistrationOTP(phoneNumber);
    res.status(200).json({
        success: true,
        message: result.message,
        data: null,
    });
}));
// ✅ Updated: OTP verify + create
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`;
    }
    const result = yield user_service_1.userService.createUser(req.body);
    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userService.getAllUser(user, req.query);
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: Object.assign({}, result),
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`;
    }
    const owner = req.user;
    const result = yield user_service_1.userService.updateUser(req.body, owner);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
}));
const userDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield user_service_1.userService.userDetails(userId);
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user;
    const { userId } = req.query;
    const { password } = req.body;
    const result = yield user_service_1.userService.deleteUser(owner, userId, password);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
    });
}));
const getUserCoins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield user_service_1.userService.getUserCoins(userId);
    res.status(200).json({
        success: true,
        message: "User coins fetched successfully",
        data: result,
    });
}));
exports.userController = {
    sendOTP,
    createUser,
    getAllUser,
    updateUser,
    userDetails,
    deleteUser,
    getUserCoins,
};
