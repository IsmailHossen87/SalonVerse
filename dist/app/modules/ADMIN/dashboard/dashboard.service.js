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
exports.dashboardService = void 0;
const reward_model_1 = require("../../reward/reward.model");
const user_model_1 = require("../../user/user.model");
const user_interface_1 = require("../../user/user.interface");
const salon_model_1 = require("../../SUPER_ADMIN/salon/salon.model");
// dashboard.service.ts
const getDashboard = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    // শেষ দিন
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const TodayIssued = yield reward_model_1.PointIssuedHistory.aggregate([
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
    const totalVisit = yield reward_model_1.ViewReward.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });
    const monthlyUsersAgg = yield user_model_1.UserModel.aggregate([
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
        const found = monthlyUsersAgg.find(u => u._id.year === currentYear && u._id.month === month);
        return {
            year: currentYear,
            month,
            totalUsers: found ? found.totalUsers : 0,
        };
    });
    // MONTHLY REWARD
    const viewRewardAvg = yield reward_model_1.ViewReward.aggregate([
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
    const mostActiveCustomer = yield reward_model_1.ViewReward.find().populate({ path: "userId", select: "name phoneNumber" }).sort({ totalPoints: -1 }).limit(10);
    const pointEarned = yield reward_model_1.ViewReward.aggregate([
        {
            $match: {
                status: user_interface_1.IStatus.APPROVED,
            },
        },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$totalPoints" },
            },
        },
    ]);
    const redeemed = yield reward_model_1.PurchaseReward.aggregate([
        {
            $match: {
                status: user_interface_1.IStatus.APPROVED
            }
        },
        {
            $group: {
                _id: null,
                totalRedeemed: { $sum: "$pointCost" }
            }
        }
    ]);
    const totalUser = yield user_model_1.UserModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });
    const totalSalon = yield salon_model_1.SalonModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
    });
    let TopPerformSalon = [];
    if (user.role === user_interface_1.USER_ROLE.SUPER_ADMIN) {
        TopPerformSalon = yield reward_model_1.ViewReward.aggregate([
            {
                $match: {
                    status: user_interface_1.IStatus.APPROVED
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
        ]);
        console.log(TopPerformSalon);
    }
    // avg visit
    const totalCoins = monthlyViewRewardAvg.reduce((acc, curr) => acc + curr.totalCoins, 0);
    const totalUniqueUsers = monthlyViewRewardAvg.reduce((acc, curr) => acc + curr.uniqueUserCount, 0);
    const avgUniqueUsers = totalCoins / totalUniqueUsers;
    // FOR ADMIN
    const totalCustomer = yield user_model_1.UserModel.countDocuments({
        role: user_interface_1.USER_ROLE.USER
    });
    const activeCustomer = yield user_model_1.UserModel.countDocuments({
        createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
        },
        role: user_interface_1.USER_ROLE.USER,
        isOnline: true
    });
    // monthly Reward
    const monthlyRewardAgg = yield reward_model_1.ViewReward.aggregate([
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
        const found = monthlyRewardAgg.find(u => u._id.year === currentYear && u._id.month === month);
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
        pointIssued: ((_a = TodayIssued[0]) === null || _a === void 0 ? void 0 : _a.totalPoints) || 0,
        avgVisit: avgUniqueUsers,
        totalUser, totalSalon,
        monthlyReward,
        PointEarned: ((_b = pointEarned[0]) === null || _b === void 0 ? void 0 : _b.totalPoints) || 0,
        Redeemed: ((_c = redeemed[0]) === null || _c === void 0 ? void 0 : _c.totalRedeemed) || 0,
        result: monthlyUsers,
        mostActiveCustomer,
        TopPerformSalon: TopPerformSalon || [],
        monthlyViewRewardAvg: monthlyViewRewardAvg || []
    };
});
exports.dashboardService = {
    getDashboard
};
