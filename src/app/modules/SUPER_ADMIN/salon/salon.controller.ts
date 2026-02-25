// salon.controller.ts
import { Request, Response, NextFunction } from "express";
import { salonService } from "./salon.service";
import catchAsync from "../../../utils/catchAsync";

const createSalon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.userId;
    const result = await salonService.createSalon(req.body, user);

    res.status(200).json({
        success: true,
        message: "Salon created successfully",
        data: result,
    });
});

const getAllSalon = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await salonService.getAllSalon(query);

    res.status(200).json({
        success: true,
        meta: result.meta,
        data: result.allData,

    });
});

const getSingleSalon = catchAsync(async (req: Request, res: Response) => {
    const user = req.user.userId;
    const result = await salonService.getSingleSalon(req.params.id as string, user);

    res.status(200).json({
        success: true,
        data: result,
    });
});

const updateSalon = catchAsync(async (req: Request, res: Response) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`;
    }
    const user = req.user.userId;

    const result = await salonService.updateSalon(req.params.id as string, req.body, user);

    res.status(200).json({
        success: true,
        message: "Salon updated successfully",
        data: result,
    });
});

const deleteSalon = catchAsync(async (req: Request, res: Response) => {
    const user = req.user.userId;
    await salonService.deleteSalon(req.params.id as string, user);

    res.status(200).json({
        success: true,
        message: "Salon deleted successfully",
    });
});

export const salonController = {
    createSalon,
    getAllSalon,
    getSingleSalon,
    updateSalon,
    deleteSalon,
};
