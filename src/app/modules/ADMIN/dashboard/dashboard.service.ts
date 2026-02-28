import { JwtPayload } from "jsonwebtoken"
import { PointIssuedHistory, PurchaseReward, ViewReward } from "../../reward/reward.model";
import { UserModel } from "../../user/user.model";
import { IStatus } from "../../user/user.interface";

// dashboard.service.ts
const getDashboard = async (user: JwtPayload) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    // শেষ দিন
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);


    const TodayIssued = await PointIssuedHistory.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: monthStart,
                    $lt: monthEnd,
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


    const totalVisit = await ViewReward.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });

    const monthlyUsersAgg = await UserModel.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalUsers: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const monthlyUsers = monthlyUsersAgg.map(u => ({
        year: u._id.year,
        month: u._id.month,
        totalUsers: u.totalUsers,
    }));

    const mostActiveCustomer = await ViewReward.find().populate({ path: "userId", select: "name phoneNumber" }).sort({ totalPoints: -1 }).limit(10)

    const pointEarned = await ViewReward.aggregate([
        {
            $match: {
                status: IStatus.APPROVED,
            },
        },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$totalPoints" },
            },
        },
    ]);

    const redeemed = await PurchaseReward.aggregate([
        {
            $match: {
                status: IStatus.APPROVED
            }
        },
        {
            $group: {
                _id: null,
                totalRedeemed: { $sum: "$pointCost" }
            }
        }
    ])


    return {
        visitToday: totalVisit,
        pointIssued: TodayIssued[0].totalPoints,
        PointEarne: pointEarned[0].totalPoints,
        Redeemed: redeemed[0].totalRedeemed,
        result: monthlyUsers, mostActiveCustomer,
    }



}


export const dashboardService = {
    getDashboard
}