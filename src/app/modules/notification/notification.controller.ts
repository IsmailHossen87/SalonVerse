// notification.controller.ts
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { NotificationService } from "./notification.service"



// user.controller.ts
// const sendNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await NotificationService.sendNotification(req.body)

//     res.status(200).json({
//         success: true,
//         message: "User created successfully",
//         data: result
//     })
// })


// GET ALL NOTIFICATION

const getAllNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await NotificationService.getAllNotification(query, req.user.userId as string)

    res.status(200).json({
        success: true,
        message: "Notification retrived successfully",
        meta: result.meta,
        data: result.data
    })
})

const getSingleNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NotificationService.getSingleNotification(req.params.id as string)

    res.status(200).json({
        success: true,
        message: "Notification retrived successfully",
        data: result
    })
})

const deleteNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NotificationService.deleteNotification(req.params.id as string)

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
        data: result
    })
})

const getNotificationCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NotificationService.getNotificationCount(req.user.userId as string)

    res.status(200).json({
        success: true,
        message: "Notification count retrived successfully",
        data: result
    })
})

export const NotificationController = {
    // sendNotification,
    getAllNotification,
    getSingleNotification,
    deleteNotification,
    getNotificationCount
}