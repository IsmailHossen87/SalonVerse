import AppError from "../../../errorHalper.ts/AppError";
import { PointIssuedHistory, ViewReward } from "../../reward/reward.model";
import { Rule } from "../../Setting/rule/rule.model";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { UserModel } from "../../user/user.model";
import { SalonModel } from "./salon.model";

export const visitSalon = async (salonId: string, userId: string) => {
    // 1️⃣ Check User
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    if (user.role !== USER_ROLE.USER) {
        throw new AppError(403, "Only users can receive visit coins");
    }

    // 2️⃣ Check Salon
    const salon = await SalonModel.findById(salonId);
    if (!salon) throw new AppError(404, "Salon not found");

    // 3️⃣ Get Smart Rule
    const rules = await Rule.findOne({ ruleType: "smartRule" });
    if (!rules) throw new AppError(404, "Smart rule not found");

    // 4️⃣ Get Riyadh Time
    const riyadhTime = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
    );

    const currentHour = riyadhTime.getHours();

    // 5️⃣ Prevent Multiple Coins Same Day
    const startOfDay = new Date(riyadhTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(riyadhTime);
    endOfDay.setHours(23, 59, 59, 999);

    const todayVisit = await ViewReward.findOne({
        userId,
        salonId,
        lastVisitAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // if (todayVisit) {
    //     throw new AppError(400, "Already received coin today");
    // }

    // 6️⃣ Monthly Visit Count
    const startOfMonth = new Date(
        riyadhTime.getFullYear(),
        riyadhTime.getMonth(),
        1
    );

    const endOfMonth = new Date(
        riyadhTime.getFullYear(),
        riyadhTime.getMonth() + 1,
        1
    );

    const totalMonthlyVisits = await ViewReward.countDocuments({
        userId,
        salonId,
        lastVisitAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // 7️⃣ Monthly Limit Check
    if (totalMonthlyVisits >= rules.totalVist) {
        throw new AppError(400, "Monthly visit limit reached");
    }

    // 8️⃣ Timezone Bonus Check
    const isInTimeZone =
        currentHour >= rules.timeZoneStart &&
        currentHour < rules.timeZoneEnd;

    // 9️⃣ Visit Count Bonus Check
    // +1 কারণ এই visit টা এখনো count হয়নি
    const nextVisitCount = totalMonthlyVisits + 1;
    const isTotalVisitBonus = nextVisitCount % rules.totalVist === 0;

    // 🔟 Coin Calculate
    let coinsToAdd = rules.everyVisitCoins;

    if (isInTimeZone) {
        coinsToAdd += rules.timeZoneGetCoin;
    }

    if (isTotalVisitBonus) {
        coinsToAdd += rules.totalVisitGetCoin;
    }

    // 1️⃣1️⃣ Create or Update Reward Entry
    const reward = await ViewReward.findOneAndUpdate(
        { userId, salonId },
        {
            $inc: {
                pendingCoins: coinsToAdd,
                viewCount: 1,
                totalCoins: coinsToAdd,
                everyVisitCoins: rules.everyVisitCoins,
                timeZoneBonusCoins: isInTimeZone ? rules.timeZoneGetCoin : 0,
                totalVisitBonusCoins: isTotalVisitBonus ? rules.totalVisitGetCoin : 0,
            },
            $set: {
                status: IStatus.PENDING,
                lastVisitAt: new Date(),
            },
        },
        { upsert: true, new: true }
    );

    return {
        message: `Visit recorded! ${coinsToAdd} coins added`,
        coinsBreakdown: {
            baseCoins: rules.everyVisitCoins,
            timezoneBonus: isInTimeZone ? rules.timeZoneGetCoin : 0,
            visitCountBonus: isTotalVisitBonus ? rules.totalVisitGetCoin : 0,
            total: coinsToAdd,
        },
        reward,
    };
};
