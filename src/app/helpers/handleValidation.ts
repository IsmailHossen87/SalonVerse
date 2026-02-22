import mongoose from "mongoose";
import { TErrorSources, TGenericResponse } from "../interface/error";

export
    const handleValidationError = (err: mongoose.Error.ValidationError): TGenericResponse => {
        const errorSources: TErrorSources[] = [];
        const errors = Object.values(err.errors);

        errors.forEach((errorObject: any) =>
            errorSources.push({
                path: errorObject.path,
                message: errorObject.message,
            })
        );

        return {
            statusCode: 400,
            message: "Mongoose validation error",
            errorSources,
        };
    };