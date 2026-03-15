// analysis.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AnalysisService } from "./analysis.service";

const getSalonHistory = catchAsync(async (req: Request, res: Response) => {
    const { salonId } = req.params;

    const result = await AnalysisService.getSalonHistory(salonId as string);

    res.status(200).json({
        success: true,
        message: "Salon history retrieved successfully",
        data: result
    });
});

const getAllSalons = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalysisService.getAllSalons(req.query);

    res.status(200).json({
        success: true,
        message: "All salons retrieved successfully",
        data: result
    });
});

const getTopServiceUsageRanking = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalysisService.getTopServiceUsageRanking();

    res.status(200).json({
        success: true,
        message: "Top service usage ranking retrieved successfully",
        data: result
    });
});

const getTopPerformingSalons = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await AnalysisService.getTopPerformingSalons(limit);

    res.status(200).json({
        success: true,
        message: "Top performing salons retrieved successfully",
        data: result
    });
});

export const AnalysisController = {
    getSalonHistory,
    getAllSalons,
    getTopServiceUsageRanking,
    getTopPerformingSalons,
};
