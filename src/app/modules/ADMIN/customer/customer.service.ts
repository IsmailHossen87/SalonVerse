import { JwtPayload } from "jsonwebtoken";
import AppError from "../../../errorHalper.ts/AppError";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { PointIssuedHistory, Reward, ViewReward } from "../../reward/reward.model";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { UserModel } from "../../user/user.model";
import httpStatus from "http-status-codes";
import mongoose from "mongoose";

// customer.service.ts
const getAllCustomer = async (query: any, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    if (user.role !== USER_ROLE.OWNER && user.role !== USER_ROLE.SUPER_ADMIN) throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    const totalUser = UserModel.find({ role: USER_ROLE.USER }).select("name email image phoneNumber coins isOnline")


    const queryBuilder = new QueryBuilder(totalUser, query)
        .search(['name  phoneNumber'])
        .filter()
        .limit()
        .paginate()

    const [meta, data] = await Promise.all([
        queryBuilder.getMeta(),
        queryBuilder.build(),
    ]);
    if (data.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No visit history found");
    }

    const totalCustomer = await UserModel.countDocuments({
        role: USER_ROLE.USER
    })
    const activeCustomer = await UserModel.countDocuments({
        role: USER_ROLE.USER,
        isOnline: true
    })
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const TodayIssued = await PointIssuedHistory.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: todayStart
                }
            }
        },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$points" }
            }
        }
    ]);

    const formattedUsers = data.map((u) => ({
        ...u.toObject(),
        name: u.name || "No Name",
        userId: u._id,
        phoneNumber: u.phoneNumber || "NO Number"
    }));


    return { meta, data: formattedUsers, dashboardData: { totalCustomer, activeCustomer, todayIssued: TodayIssued[0]?.totalPoints || 0 } }
}

const getSingleUser = async (userId: string, reqUser: JwtPayload) => {
    const user = await UserModel.findById(userId).select("-auths").populate({ path: "invitedBy", select: "name image phoneNumber" });
    const userInfo = await UserModel.findById(reqUser.userId);
    if (!userInfo) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    if (userInfo.role !== USER_ROLE.OWNER && userInfo.role !== USER_ROLE.SUPER_ADMIN) throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    const totalVisit = await ViewReward.find({ userId: new mongoose.Types.ObjectId(userId) }).select("viewCount");

    const availableReward = await Reward.find({ userId: new mongoose.Types.ObjectId(userId), status: IStatus.PENDING });

    return { user, totalVisit: totalVisit[0].viewCount || 0, availableReward }

}


// Approve Reward
const approvedReward = async (userId: string, reqUser: JwtPayload) => {
    const userInfo = await UserModel.findById(reqUser.userId);
    if (!userInfo) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    if (userInfo.role !== USER_ROLE.OWNER && userInfo.role !== USER_ROLE.SUPER_ADMIN) throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    const reward = await Reward.findById(userId);
    if (!reward) throw new AppError(httpStatus.NOT_FOUND, "Reward not found");

    reward.status = IStatus.APPROVED;
    await reward.save();

    return reward;
}

export const CustomerService = {
    getAllCustomer,
    getSingleUser,
    approvedReward
}
