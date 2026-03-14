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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitSalon = void 0;
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const socketHelper_1 = require("../../../helpers/socketHelper");
const notification_interface_1 = require("../../notification/notification.interface");
const reward_model_1 = require("../../reward/reward.model");
const rule_model_1 = require("../../Setting/rule/rule.model");
const user_interface_1 = require("../../user/user.interface");
const user_model_1 = require("../../user/user.model");
const salon_model_1 = require("./salon.model");
const visitSalon = (salonId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Check User
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user)
        throw new AppError_1.default(404, "User not found");
    if (user.role !== user_interface_1.USER_ROLE.USER) {
        throw new AppError_1.default(403, "Only users can receive visit coins");
    }
    // 2️⃣ Check Salon
    const salon = yield salon_model_1.SalonModel.findById(salonId);
    if (!salon)
        throw new AppError_1.default(404, "Salon not found");
    const admin = yield user_model_1.UserModel.findById(salon === null || salon === void 0 ? void 0 : salon.admin);
    if (!admin)
        throw new AppError_1.default(404, "Admin not found");
    // 3️⃣ Get Smart Rule
    const rules = yield rule_model_1.Rule.findOne({ ruleType: "smartRule" });
    if (!rules)
        throw new AppError_1.default(404, "Smart rule not found");
    // 4️⃣ Get Riyadh Time
    const riyadhTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
    const currentHour = riyadhTime.getHours();
    // 5️⃣ Prevent Multiple Coins Same Day
    const startOfDay = new Date(riyadhTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(riyadhTime);
    endOfDay.setHours(23, 59, 59, 999);
    const todayVisit = yield reward_model_1.ViewReward.findOne({
        userId,
        salonId,
        lastVisitAt: { $gte: startOfDay, $lte: endOfDay },
    });
    // if (todayVisit) {
    //     throw new AppError(400, "Already received coin today");
    // }
    // 6️⃣ Monthly Visit Count
    const startOfMonth = new Date(riyadhTime.getFullYear(), riyadhTime.getMonth(), 1);
    const endOfMonth = new Date(riyadhTime.getFullYear(), riyadhTime.getMonth() + 1, 1);
    const totalMonthlyVisits = yield reward_model_1.ViewReward.countDocuments({
        userId,
        salonId,
        lastVisitAt: { $gte: startOfMonth, $lt: endOfMonth },
    });
    // 7️⃣ Monthly Limit Check
    if (totalMonthlyVisits >= rules.totalVist) {
        throw new AppError_1.default(400, "Monthly visit limit reached");
    }
    // 8️⃣ Timezone Bonus Check
    const isInTimeZone = currentHour >= rules.timeZoneStart &&
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
    const reward = yield reward_model_1.ViewReward.findOneAndUpdate({ userId, salonId }, {
        $inc: {
            pendingCoins: coinsToAdd,
            viewCount: 1,
            totalCoins: coinsToAdd,
            everyVisitCoins: rules.everyVisitCoins,
            timeZoneBonusCoins: isInTimeZone ? rules.timeZoneGetCoin : 0,
            totalVisitBonusCoins: isTotalVisitBonus ? rules.totalVisitGetCoin : 0,
        },
        $set: {
            status: user_interface_1.IStatus.PENDING,
            lastVisitAt: new Date(),
        },
    }, { upsert: true, new: true });
    yield reward_model_1.PointIssuedHistory.create({
        userId: userId,
        salonId: salonId,
        points: coinsToAdd,
    });
    // if (user.fcmToken) {
    //     await firebaseNotificationBuilder({
    //         user: user,
    //         title: "You've successfully visited a salon",
    //         body: `You've sucessfully visited a salon and received ${coinsToAdd} coins`,
    //         notificationEvent: INOTIFICATION_EVENT.VISIT,
    //         notificationType: INOTIFICATION_TYPE.NOTIFICATION,
    //         referenceId: user._id,
    //         referenceType: "User"
    //     })
    // }
    socketHelper_1.socketHelper.emit("notification", {
        receiver: user._id.toString(),
        title: "Visit Reward pending",
        message: `You've successfully visited a salon and pending ${coinsToAdd} coins`,
        type: "VISIT_REWARD",
    });
    yield (0, socketHelper_1.saveNotification)({
        receiverId: user._id,
        title: "Visit Reward pending",
        body: `You've successfully visited a salon and pending ${coinsToAdd} coins for approval`,
        notificationEvent: notification_interface_1.INOTIFICATION_EVENT.VISIT,
        notificationType: notification_interface_1.INOTIFICATION_TYPE.NOTIFICATION,
        read: false,
    });
    // realtime notification for admin
    socketHelper_1.socketHelper.emit("notification", {
        receiver: admin._id,
        title: "Reward Claimed",
        message: `${user.name} claimed successfully`,
        type: "INVITE_REWARD",
    });
    yield (0, socketHelper_1.saveNotification)({
        receiverId: admin._id,
        title: "Reward Claimed",
        body: `${user.name} visited your salon and claimed ${coinsToAdd} coins pending`,
        notificationEvent: notification_interface_1.INOTIFICATION_EVENT.PURCHASE_REWARD,
        notificationType: notification_interface_1.INOTIFICATION_TYPE.NOTIFICATION,
        referenceId: user._id,
        referenceType: notification_interface_1.IREFERENCE_TYPE.USER,
        read: false,
    });
    return {
        message: `Visit recorded! ${coinsToAdd} coins pending`,
        coinsBreakdown: {
            baseCoins: rules.everyVisitCoins,
            timezoneBonus: isInTimeZone ? rules.timeZoneGetCoin : 0,
            visitCountBonus: isTotalVisitBonus ? rules.totalVisitGetCoin : 0,
            total: coinsToAdd,
        },
        reward,
    };
});
exports.visitSalon = visitSalon;
