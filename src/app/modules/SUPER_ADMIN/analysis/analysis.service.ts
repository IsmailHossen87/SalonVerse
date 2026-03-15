// analysis.service.ts
import mongoose from "mongoose";
import AppError from "../../../errorHalper.ts/AppError";
import httpStatus from "http-status-codes";
import { PointIssuedHistory, ViewReward } from "../../reward/reward.model";
import { SalonModel } from "../salon/salon.model";
import { IStatus } from "../../user/user.interface";


const getSalonHistory = async (salonId: string) => {

    const salon = await SalonModel.findById(salonId);
    if (!salon) {
        throw new AppError(httpStatus.NOT_FOUND, "Salon not found");
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const monthsPassed = now.getMonth() + 1; // 1 to 12

    // 1. Monthly Visit Freq (Current Month)
    const monthlyVisitFreq = await ViewReward.countDocuments({
        salonId: new mongoose.Types.ObjectId(salonId),
        createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    // 2. Monthly Avg Visit Freq (Total Visits this year / months passed)
    const totalYearlyVisits = await ViewReward.countDocuments({
        salonId: new mongoose.Types.ObjectId(salonId),
        createdAt: { $gte: yearStart, $lt: now }
    });
    const monthlyAvgVisitFreq = Math.round(totalYearlyVisits / monthsPassed);

    // 3. Avg. Monthly Revenue (Current Month Points/Coins Equivalent from Approved or All visits)
    const avgMonthlyRevenueAgg = await ViewReward.aggregate([
        {
            $match: {
                salonId: new mongoose.Types.ObjectId(salonId),
                createdAt: { $gte: monthStart, $lt: monthEnd }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalCoins" }
            }
        }
    ]);
    const avgMonthlyRevenue = avgMonthlyRevenueAgg[0]?.totalRevenue || 0;

    // 4. Customers in last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const customersInLast30DaysAgg = await ViewReward.aggregate([
        {
            $match: {
                salonId: new mongoose.Types.ObjectId(salonId),
                createdAt: { $gte: thirtyDaysAgo, $lt: now }
            }
        },
        {
            $group: {
                _id: "$userId"
            }
        },
        {
            $count: "uniqueCustomers"
        }
    ]);

    const customersInLast30Days = customersInLast30DaysAgg[0]?.uniqueCustomers || 0;

    // 5. Daily Revenue (Last 30 Days) Chart
    const dailyRevenueAgg = await ViewReward.aggregate([
        {
            $match: {
                salonId: new mongoose.Types.ObjectId(salonId),
                createdAt: { $gte: thirtyDaysAgo, $lt: now }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                revenue: { $sum: "$totalCoins" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const dailyRevenue = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const found = dailyRevenueAgg.find(item => item._id === dateStr);
        dailyRevenue.push({
            date: dateStr,
            revenue: found ? found.revenue : 0
        });
    }

    // 6. Insights: Best Day, Slowest Day, Avg Customer Spend
    const dayOfWeekAgg = await ViewReward.aggregate([
        {
            $match: {
                salonId: new mongoose.Types.ObjectId(salonId),
                createdAt: { $gte: thirtyDaysAgo, $lt: now }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: "$createdAt" }, // 1 = Sunday, 2 = Monday, etc.
                totalVisits: { $sum: 1 },
                totalRevenue: { $sum: "$totalCoins" }
            }
        },
        { $sort: { totalVisits: -1 } }
    ]);

    const daysMap = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let bestDay = "N/A";
    let slowestDay = "N/A";

    if (dayOfWeekAgg.length > 0) {
        bestDay = daysMap[dayOfWeekAgg[0]._id];
        slowestDay = daysMap[dayOfWeekAgg[dayOfWeekAgg.length - 1]._id];
    }

    // Avg Customer Spend (Total Revenue last 30 days / Total Customers last 30 days)
    const totalRevenueLast30Days = dailyRevenueAgg.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgCustomerSpend = customersInLast30Days > 0 ? Math.round(totalRevenueLast30Days / customersInLast30Days) : 0;

    return {
        metrics: {
            monthlyVisitFreq,
            monthlyAvgVisitFreq,
            avgMonthlyRevenue,
            customersInLast30Days
        },
        dailyRevenue,
        topPerformingServices: [
            { name: salon.service || "General Service", percentage: 100 }
        ],
        insights: {
            bestDay,
            slowestDay,
            avgCustomerSpend
        }
    }
}


// ─── GET ALL SALONS (with search, filter by status, pagination) ───
const getAllSalons = async (query: Record<string, any>) => {
    const { search, activeStatus, page = 1, limit = 10 } = query;

    const filter: Record<string, any> = {};

    if (search) {
        filter.$or = [
            { businessName: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
        ];
    }

    if (activeStatus) {
        filter.activeStatus = activeStatus;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await SalonModel.countDocuments(filter);

    const salons = await SalonModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    // Attach totalVisits and customersCount for each salon
    const salonIds = salons.map(s => s._id);

    const visitAgg = await ViewReward.aggregate([
        { $match: { salonId: { $in: salonIds } } },
        {
            $group: {
                _id: "$salonId",
                totalVisits: { $sum: "$viewCount" },
                totalPoints: { $sum: "$totalCoins" },
                uniqueCustomers: { $addToSet: "$userId" },
            }
        }
    ]);

    const visitMap: Record<string, any> = {};
    for (const v of visitAgg) {
        visitMap[v._id.toString()] = {
            totalVisits: v.totalVisits || 0,
            customersCount: v.uniqueCustomers?.length || 0,
            totalPoints: v.totalPoints || 0,
        };
    }

    const data = salons.map((salon: any) => {
        const stats = visitMap[salon._id.toString()] || { totalVisits: 0, customersCount: 0, totalPoints: 0 };
        return {
            _id: salon._id,
            salonId: salon.salonId,
            businessName: salon.businessName,
            city: salon.city,
            service: salon.service,
            image: salon.image,
            location: salon.location,
            activeStatus: salon.activeStatus,
            subscriptionType: salon.subscriptionType,
            expiryDate: salon.expiryDate,
            totalVisits: stats.totalVisits,
            customersCount: stats.customersCount,
            totalPoints: stats.totalPoints,
        };
    });

    return {
        meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
        data,
    };
};


// ─── TOP SERVICE USAGE RANKING ───
const getTopServiceUsageRanking = async () => {
    // Aggregate all ViewReward grouped by salonId, lookup salon service name
    const serviceAgg = await ViewReward.aggregate([
        {
            $group: {
                _id: "$salonId",
                totalVisits: { $sum: "$viewCount" },
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
        { $unwind: { path: "$salon" } },
        {
            $group: {
                _id: "$salon.service",
                totalVisits: { $sum: "$totalVisits" },
                branchCount: { $sum: 1 }
            }
        },
        { $sort: { totalVisits: -1 } }
    ]);

    const grandTotal = serviceAgg.reduce((acc: number, curr: any) => acc + curr.totalVisits, 0);

    const ranking = serviceAgg.map((item: any) => ({
        serviceName: item._id || "General Service",
        totalVisits: item.totalVisits,
        branchCount: item.branchCount,
        percentage: grandTotal > 0 ? Math.round((item.totalVisits / grandTotal) * 100) : 0,
    }));

    return ranking;
};



// ─── TOP PERFORMING SALONS (based on customer engagement / total points) ───
const getTopPerformingSalons = async (limit: number = 10) => {
    const topSalons = await ViewReward.aggregate([
        {
            $group: {
                _id: "$salonId",
                totalPoints: { $sum: "$totalCoins" },
                uniqueCustomers: { $addToSet: "$userId" },
                totalVisits: { $sum: "$viewCount" },
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
        { $unwind: { path: "$salon" } },
        {
            $project: {
                _id: 0,
                salonId: "$salon._id",
                businessName: "$salon.businessName",
                city: "$salon.city",
                service: "$salon.service",
                image: "$salon.image",
                activeStatus: "$salon.activeStatus",
                totalPoints: 1,
                totalVisits: 1,
                customersCount: { $size: "$uniqueCustomers" },
            }
        },
        { $sort: { totalPoints: -1 } },
        { $limit: limit }
    ]);

    const maxPoints = topSalons[0]?.totalPoints || 1;

    return topSalons.map((salon: any) => ({
        ...salon,
        percentage: Math.round((salon.totalPoints / maxPoints) * 100),
    }));
};


export const AnalysisService = {
    getSalonHistory,
    getAllSalons,
    getTopServiceUsageRanking,
    getTopPerformingSalons,
}
