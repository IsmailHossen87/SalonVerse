import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHalper.ts/AppError";
import { TErrorSources } from "../interface/error";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handle.castError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidation";

export const globalErrorHandlare = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = err.message || `Something went wrong ${err.message}`;
    let errorSources: TErrorSources[] = [];


    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // It has no Source
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // It has no Source
    } else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    } else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
        // custom error
    } else if (err instanceof AppError) {
        message = err.message;
        statusCode = err.statusCode;
    } else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVar.NODE_ENV === "development" ? err : null,
        stack: envVar.NODE_ENV === "development" ? err.stack : null,
    });
}