import cron from "node-cron";
import { dailySubscriptionCheck } from "../../SUPER_ADMIN/salon/salon.service";
import { Reward, ViewReward } from "../../reward/reward.model";
import { IStatus } from "../../user/user.interface";
import { UserModel } from "../../user/user.model";
import { firebaseNotificationBuilder } from "../../../shared/sendNotification";
import { INOTIFICATION_EVENT } from "../../notification/notification.interface";
import mongoose from "mongoose";

export const startCheckSubscriptionCron = () => cron.schedule("0 0 * * *", async () => {
    console.log("Daily subscription check started");
    await dailySubscriptionCheck();
});


export const startRewardExpireCron = () => {

    // Every 10 minutes run hobe
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();

            const result = await Reward.updateMany(
                {
                    expiresAt: { $lt: now },
                    isUsed: false,
                    status: { $ne: IStatus.EXPIRED }
                },
                {
                    $set: { status: IStatus.EXPIRED }
                }
            );

            console.log(`Expired rewards updated: ${result.modifiedCount}`);
        } catch (error) {
            console.error("Reward expire cron error:", error);
        }
    });

};

export const startNotificationCrons = () => {

    // 1️⃣ Daily Engagement Crons (Every day at 10:00 AM)
    cron.schedule("0 10 * * *", async () => {
        try {
            console.log("Daily engagement crons started");
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            // Phase 1 - Notification 2: Complete Profile (incomplete > 1 day)
            const incompleteUsers = await UserModel.find({
                isCompleted: false,
                createdAt: { $lt: oneDayAgo },
                fcmToken: { $exists: true, $ne: "" }
            }).select("+fcmToken");
            incompleteUsers.forEach(user => {
                firebaseNotificationBuilder({
                    user,
                    title: "Complete Your Profile ✨",
                    body: "So salons can recognize you instantly ✨",
                    saveToDatabase: false
                });
            });

            // Phase 1 - Notification 3: First Visit Push (no visits after 1 day)
            const newUsersWithNoVisits = await UserModel.aggregate([
                { $match: { createdAt: { $lt: oneDayAgo }, fcmToken: { $exists: true, $ne: "" } } },
                {
                    $lookup: {
                        from: "viewrewards",
                        localField: "_id",
                        foreignField: "userId",
                        as: "visits"
                    }
                },
                { $match: { "visits.0": { $exists: false } } },
                { $project: { fcmToken: 1, name: 1, email: 1 } }
            ]);
            // Since aggregate results are POJOs, and fcmToken was in the match, it might be there if not explicitly excluded, 
            // but we might need to project it in aggregate if it's select:false.
            // Let's add a projection to be safe.
            newUsersWithNoVisits.forEach(user => {
                firebaseNotificationBuilder({
                    user,
                    title: "Your glow starts here",
                    body: "Your glow starts with one visit ✨",
                    saveToDatabase: false
                });
            });

            // Phase 2 - Notification 5, 6, 7: Reminders (1, 3, 7 days)
            // 24h After Visit
            const oneDayReminders = await ViewReward.find({
                lastVisitAt: { $lt: oneDayAgo, $gt: new Date(oneDayAgo.getTime() - 12 * 60 * 60 * 1000) }
            }).populate({ path: "userId", select: "+fcmToken" });
            oneDayReminders.forEach(reward => {
                if ((reward.userId as any)?.fcmToken) {
                    firebaseNotificationBuilder({
                        user: reward.userId,
                        title: "You looked amazing yesterday",
                        body: "Ready for your next glow?",
                        saveToDatabase: false
                    });
                }
            });

            // 3-Day Reminder
            const threeDayReminders = await ViewReward.find({
                lastVisitAt: { $lt: threeDaysAgo, $gt: new Date(threeDaysAgo.getTime() - 12 * 60 * 60 * 1000) }
            }).populate({ path: "userId", select: "+fcmToken" });
            threeDayReminders.forEach(reward => {
                if ((reward.userId as any)?.fcmToken) {
                    firebaseNotificationBuilder({
                        user: reward.userId,
                        title: "A little self-care never hurts",
                        body: "It's been 3 days since your last visit. Treat yourself!",
                        saveToDatabase: false
                    });
                }
            });

            // 7-Day Reminder
            const sevenDayReminders = await ViewReward.find({
                lastVisitAt: { $lt: sevenDaysAgo, $gt: new Date(sevenDaysAgo.getTime() - 12 * 60 * 60 * 1000) }
            }).populate({ path: "userId", select: "+fcmToken" });
            sevenDayReminders.forEach(reward => {
                if ((reward.userId as any)?.fcmToken) {
                    firebaseNotificationBuilder({
                        user: reward.userId,
                        title: "Time to feel fresh again",
                        body: "It’s been a week… time to feel fresh again ✨",
                        saveToDatabase: false
                    });
                }
            });

        } catch (error) {
            console.error("Daily notification cron error:", error);
        }
    });

    // 2️⃣ Thursday Pre-Weekend Reminder (#14) at 10:00 AM
    cron.schedule("0 10 * * 4", async () => {
        try {
            console.log("Thursday pre-weekend cron started");
            const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

            const users = await ViewReward.find({
                lastVisitAt: { $lt: fiveDaysAgo }
            }).populate({ path: "userId", select: "+fcmToken" });

            users.forEach(reward => {
                if ((reward.userId as any)?.fcmToken) {
                    firebaseNotificationBuilder({
                        user: reward.userId,
                        title: "Weekend is coming",
                        body: "Ready for your glow?",
                        saveToDatabase: false
                    });
                }
            });
        } catch (error) {
            console.error("Thursday cron error:", error);
        }
    });

    // 3️⃣ Saturday Evening Reminder (#17) at 6:00 PM
    cron.schedule("0 18 * * 6", async () => {
        try {
            console.log("Saturday evening cron started");
            const fridayStart = new Date();
            fridayStart.setDate(fridayStart.getDate() - 1);
            fridayStart.setHours(0, 0, 0, 0);

            const usersNoVisitWeekend = await UserModel.aggregate([
                { $match: { role: "USER", fcmToken: { $exists: true, $ne: "" } } },
                {
                    $lookup: {
                        from: "viewrewards",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$userId", "$$userId"] },
                                    lastVisitAt: { $gte: fridayStart }
                                }
                            }
                        ],
                        as: "weekendVisits"
                    }
                },
                { $match: { "weekendVisits.0": { $exists: false } } },
                { $project: { fcmToken: 1, name: 1, email: 1 } }
            ]);

            usersNoVisitWeekend.forEach(user => {
                firebaseNotificationBuilder({
                    user,
                    title: "Last chance this weekend",
                    body: "Don’t miss your glow session!",
                    saveToDatabase: false
                });
            });
        } catch (error) {
            console.error("Saturday cron error:", error);
        }
    });
};