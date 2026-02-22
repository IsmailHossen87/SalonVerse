import { Request, Response } from "express";
import httpStatus from "http-status-codes"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        sucess: false,
        message: "Route Not Found"
    })
}