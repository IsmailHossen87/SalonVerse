// referral.controller.ts
import { Request, Response } from "express";
import { ReferralService } from "./referral.service";

const getMyReferralLink = async (req: Request, res: Response) => {
    try {

        const userId = req.user.userId;

        const result = await ReferralService.getMyReferralLink(userId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const ReferralController = {
    getMyReferralLink
};
