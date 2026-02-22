import { TGenericResponse } from "../interface/error";


export const handleDuplicateError = (err: any): TGenericResponse => {
    const match = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: match ? `${match[1]} already exists` : "Duplicate field value entered",
    };
};