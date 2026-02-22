import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RuleService } from './rule.service';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import AppError from '../../../errorHalper.ts/AppError';
import { RuleType } from './rule.interface';


const globalRule = catchAsync(async (req: Request, res: Response) => {
     const { platformName, supportEmail, passwordLength, ruleType } = req.body;
     const payload = {
          platformName,
          supportEmail,
          passwordLength,
          ruleType
     }
     const result = await RuleService.globalRule(payload);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Content upserted successfully',
          data: result,
     });
});
const smartRule = catchAsync(async (req: Request, res: Response) => {
     const { everyVisitCoins, timeZoneStart, timeZoneEnd, timeZoneGetCoin, totalVist, totalVisitGetCoin, inviteEarCoin, ruleType } = req.body;
     const payload = {
          everyVisitCoins,
          timeZoneStart,
          timeZoneEnd,
          timeZoneGetCoin,
          totalVist,
          totalVisitGetCoin,
          inviteEarCoin,
          ruleType
     }

     const result = await RuleService.smartRule(payload);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Content upserted successfully',
          data: result,
     });
});


const rewardRule = catchAsync(async (req: Request, res: Response) => {
     const { tireName, tireCoins, tireLevel, ruleType } = req.body;
     const payload = {
          tireName,
          tireCoins,
          tireLevel,
          ruleType
     }
     if (!payload) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Payload is required!');
     }
     const result = await RuleService.rewardRule(payload);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Content upserted successfully',
          data: result,
     });
});


const getRule = catchAsync(async (req: Request, res: Response) => {
     const { ruleType } = req.params;
     const result = await RuleService.getRule(ruleType as RuleType);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Content upserted successfully',
          data: result,
     });
});

export const RuleController = {
     globalRule,
     smartRule,
     rewardRule,
     getRule
}
