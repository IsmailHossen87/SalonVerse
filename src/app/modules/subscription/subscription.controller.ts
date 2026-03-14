import { Request, Response, NextFunction } from 'express';
import { SubscriptionServices } from './subscription.service';

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';


// create subscription
const createSubscription = catchAsync(async (req: Request, res: Response) => {
     const result = await SubscriptionServices.createSubscriptionIntoDB({
          ...req.body,
          user: (req.user)?.id,
     });

     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Subscription created successfully',
          data: result,
     });
});

export const SubscriptionController = {
     createSubscription,
};
