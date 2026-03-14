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
exports.VisitController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const visit_service_1 = require("./visit.service");
// user.controller.ts
const getAllVisitRecord = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield visit_service_1.VisitService.getAllVisitRecord(req.query);
    res.status(200).json({
        success: true,
        message: "All Visit Record fetched successfully",
        data: result
    });
}));
// VISIT confirm By Owner
const confirmVisit = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield visit_service_1.VisitService.approveVisitCoin(req.params.id, req.user.userId);
    res.status(200).json({
        success: true,
        message: "Visit confirmed successfully",
        data: result
    });
}));
exports.VisitController = {
    getAllVisitRecord,
    confirmVisit
};
