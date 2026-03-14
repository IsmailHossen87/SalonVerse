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
exports.checkAuth = void 0;
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../modules/user/user.interface");
const AppError_1 = __importDefault(require("../errorHalper.ts/AppError"));
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const accessToken = req.headers.authorization;
        const tokenWithBearer = req.headers.authorization;
        if (!tokenWithBearer) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Token Recieved");
        }
        const accessToken = tokenWithBearer.split(' ')[1]; // tokenWithBearer.startsWith('Bearer')
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Token Recieved");
        }
        const verifyedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVar.JWT_SECRET);
        const isUserExites = yield user_model_1.UserModel.findOne({ _id: verifyedToken.userId });
        if (!isUserExites) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User  does not Exit");
        }
        if (isUserExites.status === user_interface_1.IStatus.BLOCKED || isUserExites.status === user_interface_1.IStatus.DELETED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExites.status}`);
        }
        // if (isUserExites.isDeleted) {
        //     throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        // }
        if (!isUserExites.verified) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
        }
        if (!authRoles.includes(verifyedToken.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Your are not Permitted to view this route");
        }
        // global authentication er jonno
        req.user = verifyedToken;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.checkAuth = checkAuth;
