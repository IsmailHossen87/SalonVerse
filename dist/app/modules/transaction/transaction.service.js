"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
// transaction.service.ts
const buyTireTransaction = (userId, tireId) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     console.log("checking 1---------------------2")
    //     const user = await UserModel.findById(userId)
    //     if (!user) throw new AppError(httpStatus.NOT_FOUND,"User not found")
    //     const tire = await Tire.findById(tireId)
    //     if (!tire) throw new Error("Tire not found")
    //     const TransactionInfo = await Transaction.create({
    //         userId: user._id,
    //         tireId: tire._id,
    //         amount: tire.price,
    //         type: tire.type,
    //         currency: "usd",
    //         paymentMethod: "stripe",
    //         status: "pending",
    //     })
    //     if (tire.type === "coin") {
    //         user.coin += Number(tire.value)
    //         await user.save()
    //         return {
    //             message: `Transaction created successfully, you got ${tire.value} coin`,
    //             data: TransactionInfo
    //         }
    //     }
    //     if (tire.type === "credit") {
    //         user.moneyCredit += tire.value
    //         await user.save()
    //         return {
    //             message: `Transaction created successfully, you got ${tire.value} credit`,
    //             data: TransactionInfo
    //         }
    //     }
    // } catch (error: any) {
    //     throw new AppError(httpStatus.NOT_FOUND, error.message)
    // }
});
exports.TransactionService = {
    buyTireTransaction
};
