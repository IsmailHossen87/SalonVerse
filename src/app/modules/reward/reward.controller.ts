import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RewardService } from './reward.service';

const activeReward = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params
    const query = req.query
    const result = await RewardService.activeReward(req.user.userId as string, type as string, query as Record<string, string>)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Get ${type} retrived Reward`,
        meta: result.meta,
        data: { ...result.data, rewards: result.data.rewards },
    });
});


export const RewardConroller = {
    activeReward
}