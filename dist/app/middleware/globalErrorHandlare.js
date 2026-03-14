"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandlare = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHalper.ts/AppError"));
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handle_castError_1 = require("../helpers/handle.castError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleValidation_1 = require("../helpers/handleValidation");
const globalErrorHandlare = (err, req, res, next) => {
    let statusCode = 500;
    let message = err.message || `Something went wrong ${err.message}`;
    let errorSources = [];
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // It has no Source
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handle_castError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // It has no Source
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidation_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
        // custom error
    }
    else if (err instanceof AppError_1.default) {
        message = err.message;
        statusCode = err.statusCode;
    }
    else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVar.NODE_ENV === "development" ? err : null,
        stack: env_1.envVar.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandlare = globalErrorHandlare;
