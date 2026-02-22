// invite.controller.ts
import { NextFunction, Request, Response } from "express";
import { InviteService } from "./invite.service";
import { Types } from "mongoose";
import catchAsync from "../../utils/catchAsync";



// user.controller.ts
const completeInvite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { inviterId, invitedUserId } = req.body;
    const result = await InviteService.completeInvite(new Types.ObjectId(inviterId), new Types.ObjectId(invitedUserId));
    res.status(200).json({
        success: true,
        message: "Invite completed successfully",
        data: result
    })
})

export const InviteController = {
    completeInvite
}
