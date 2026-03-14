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
exports.verifyRecaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const verifyRecaptcha = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET,
            response: token,
        },
    });
    if (!response.data.success) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "reCAPTCHA failed");
    }
});
exports.verifyRecaptcha = verifyRecaptcha;
