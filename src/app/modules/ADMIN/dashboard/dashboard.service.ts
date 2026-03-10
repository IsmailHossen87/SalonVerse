import { JwtPayload } from "jsonwebtoken"
import { PointIssuedHistory, PurchaseReward, ViewReward } from "../../reward/reward.model";
import { UserModel } from "../../user/user.model";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { SalonModel } from "../../SUPER_ADMIN/salon/salon.model";

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

    const currentYear = new Date().getFullYear();

    const monthlyUsers = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const found = monthlyUsersAgg.find(
            u => u._id.year === currentYear && u._id.month === month
        );
        return {
            year: currentYear,
            month,
            totalUsers: found ? found.totalUsers : 0,
        };
    });
    // MONTHLY REWARD
    const viewRewardAvg = await ViewReward.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalCoins: { $sum: "$totalCoins" },
                uniqueUsers: { $addToSet: "$userId" },
            },
        },
        {
            $addFields: {
                uniqueUserCount: { $size: "$uniqueUsers" },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const monthlyViewRewardAvg = viewRewardAvg.map(u => ({
        year: u._id.year,
        month: u._id.month,
        totalCoins: u.totalCoins,
        uniqueUserCount: u.uniqueUserCount,
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

    const totalUser = await UserModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });
    const totalSalon = await SalonModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });

    let TopPerformSalon = []
    if (user.role === USER_ROLE.SUPER_ADMIN) {
        TopPerformSalon = await ViewReward.aggregate([
            {
                $match: {
                    status: IStatus.APPROVED
                }
            },
            {
                $group: {
                    _id: "$salonId",
                    totalCoins: { $sum: "$totalCoins" }
                }
            },
            {
                $lookup: {
                    from: "salons",
                    localField: "_id",
                    foreignField: "_id",
                    as: "salon"
                }
            },
            {
                $unwind: "$salon"
            },
            {
                $project: {
                    salonName: "$salon.businessName",
                    salonImage: "$salon.image",
                    totalCoins: 1
                }
            },
            {
                $sort: {
                    totalCoins: -1
                }
            },
            {
                $limit: 10
            }
        ])

        console.log(TopPerformSalon)
    }

    // avg visit
    const totalCoins = monthlyViewRewardAvg.reduce((acc, curr) => acc + curr.totalCoins, 0);
    const totalUniqueUsers = monthlyViewRewardAvg.reduce((acc, curr) => acc + curr.uniqueUserCount, 0);
    const avgUniqueUsers = totalCoins / totalUniqueUsers;

    // FOR ADMIN
    const totalCustomer = await UserModel.countDocuments({
        role: USER_ROLE.USER
    });
    const activeCustomer = await UserModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
        role: USER_ROLE.USER,
        isOnline: true
    });

    // monthly Reward
    const monthlyRewardAgg = await ViewReward.aggregate([
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

    const monthlyReward = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const found = monthlyRewardAgg.find(
            u => u._id.year === currentYear && u._id.month === month
        );
        return {
            year: currentYear,
            month,
            totalUsers: found ? found.totalUsers : 0, // ← না থাকলে 0
        };
    });


    return {
        visitToday: totalVisit,
        totalCustomer: totalCustomer || 0,
        activeCustomer: activeCustomer || 0,
        pointIssued: TodayIssued[0]?.totalPoints || 0,
        avgVisit: avgUniqueUsers,
        totalUser, totalSalon,
        monthlyReward,
        PointEarned: pointEarned[0]?.totalPoints || 0,
        Redeemed: redeemed[0]?.totalRedeemed || 0,
        result: monthlyUsers,
        mostActiveCustomer,
        TopPerformSalon: TopPerformSalon || [],
        monthlyViewRewardAvg: monthlyViewRewardAvg || []
    }



}


export const dashboardService = {
    getDashboard
}