import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import AppError from '../../../errorHalper.ts/AppError';
import { RuleType } from './rule.interface';
import { RuleService } from './rule.service';


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


const tireRule = catchAsync(async (req: Request, res: Response) => {
     const { tireName, tireCoins } = req.body;
     const result = await RuleService.tireRule({ tireName, tireCoins }, req.user?.userId as string);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Tire  created successfully',
          data: result,
     });
});

const allTire = catchAsync(async (req: Request, res: Response) => {
     const result = await RuleService.getTire();

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Content upserted successfully',
          data: result,
     });
})

const updateTire = catchAsync(async (req: Request, res: Response) => {
     const { tireName, tireCoins } = req.body;
     const id = req.params.id as string;
     const result = await RuleService.updateTire({ tireName, tireCoins }, id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Tire  updated successfully',
          data: result,
     });
})


// Time & Day Rule controllers
const createTimeDayRule = catchAsync(async (req: Request, res: Response) => {
     const result = await RuleService.createTimeDayRule(req.body);
     sendResponse(res,
          {
               success: true,
               statusCode: StatusCodes.CREATED,
               message: 'Time & Day rule created',
               data: result
          });
});

const getAllTimeDayRules = catchAsync(async (req: Request, res: Response) => {
     const result = await RuleService.getAllTimeDayRules();
     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Time & Day rules fetched', data: result });
});

const toggleTimeDayRule = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const { isActive } = req.body;
     const result = await RuleService.toggleTimeDayRule(id, isActive);
     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Time & Day rule updated', data: result });
});


const deleteTimeDayRule = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const result = await RuleService.deleteTimeDayRule(id);
     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Time & Day rule deleted', data: result });
});

const updateSmartRule = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const result = await RuleService.updateSmartRule(id, req.body);
     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Smart rule updated', data: result });
});

const tireIsActive = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const result = await RuleService.tireIsActive(id);
     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Tire is active updated', data: result });
});

export const RuleController = {
     globalRule,
     smartRule,
     getRule,
     tireRule,
     allTire,
     createTimeDayRule,
     getAllTimeDayRules,
     toggleTimeDayRule,
     deleteTimeDayRule,
     updateTire,
     updateSmartRule,
     tireIsActive,
}
