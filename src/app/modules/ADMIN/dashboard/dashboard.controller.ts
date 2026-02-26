// dashboard.controller.ts
// customer.controller.ts
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { dashboardService } from "./dashboard.service";




// user.controller.ts
const getDashboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await dashboardService.getDashboard(req.user as JwtPayload);
    res.status(200).json({
        success: true,
        message: "Dashboard fetched successfully",
        data: result,

    })
})


export const DashboardController = {
    getDashboard
}