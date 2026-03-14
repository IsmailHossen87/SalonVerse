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
exports.PackageController = void 0;
const package_service_1 = require("./package.service");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createPackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_service_1.PackageService.createPackageIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Package created successfully',
        data: result,
    });
}));
// update package
const updatePackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_service_1.PackageService.updatePackageIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Package updated successfully',
        data: result,
    });
}));
// delete package
const deletePackage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_service_1.PackageService.deletePackageFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Package deleted successfully',
        data: result,
    });
}));
// get all packages
const getAllPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_service_1.PackageService.getAllPackagesFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Packages fetched successfully',
        data: result,
    });
}));
exports.PackageController = {
    createPackage,
    getAllPackages,
    updatePackage,
    deletePackage,
};
