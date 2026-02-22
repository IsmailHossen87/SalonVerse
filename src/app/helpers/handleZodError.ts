import { TErrorSources, TGenericResponse } from "../interface/error";


export const handleZodError = (err: any): TGenericResponse => {
    const errorSources: TErrorSources[] = [];

    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        });
    });

    return {
        statusCode: 400,
        message: "Zod validation error",
        errorSources,
    };
};