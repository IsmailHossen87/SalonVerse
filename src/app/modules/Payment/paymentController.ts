
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createPaymentService } from "./PaymentService";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const buyMoneyCredits = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  // const paymentSession = await createPaymentService.createPaymentIntent(req.params.id as string, userId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Redirect to payment",
    data: null
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment success',
    data: null
  });
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment cancel',
    data: null
  });
});



export const PaymentController = { buyMoneyCredits, paymentSuccess, paymentCancel };