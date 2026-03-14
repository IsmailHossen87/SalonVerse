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
exports.PackageService = exports.createPackageIntoDB = void 0;
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const package_model_1 = require("./package.model");
const http_status_codes_1 = require("http-status-codes");
// -- -------------- create package --------------
const createPackageIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if package already exist
    const existingPackage = yield package_model_1.Package.exists({
        name: payload.name,
        isDeleted: false,
    });
    if (existingPackage) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Package already exists');
    }
    const result = yield package_model_1.Package.create(payload);
    return result;
});
exports.createPackageIntoDB = createPackageIntoDB;
// -------------- update package --------------
const updatePackageIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if package exists
    const existingPackage = yield package_model_1.Package.findById(id);
    if (!existingPackage) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found');
    }
    // check if the name already taken
    if (payload.name && payload.name !== existingPackage.name) {
        const nameTaken = yield package_model_1.Package.exists({
            name: payload.name,
            isDeleted: false,
            _id: { $ne: id },
        });
        if (nameTaken) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Package name already in use');
        }
    }
    const result = yield package_model_1.Package.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
// -------------- delete package --------------
const deletePackageFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if package exists
    const existingPackage = yield package_model_1.Package.exists({ _id: id });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found');
    }
    const result = yield package_model_1.Package.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ------------ get all packages --------------
const getAllPackagesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_model_1.Package.find({ isDeleted: false });
    return result;
});
exports.PackageService = {
    createPackageIntoDB: exports.createPackageIntoDB,
    getAllPackagesFromDB,
    updatePackageIntoDB,
    deletePackageFromDB,
};
