
import AppError from "../../errorHalper.ts/AppError"
import { Tire } from "../Setting/rule/rule.model"
import { UserModel } from "../user/user.model"
import { ITransaction } from "./transaction.interface"
import { Transaction } from "./transaction.model"
import httpStatus from "http-status-codes"

// transaction.service.ts
const buyTireTransaction = async (userId: string, tireId: string) => {
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
}



export const TransactionService = {
    buyTireTransaction
}