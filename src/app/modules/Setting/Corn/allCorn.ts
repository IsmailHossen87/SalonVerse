import cron from "node-cron";
import { dailySubscriptionCheck } from "../../SUPER_ADMIN/salon/salon.service";
import { Reward } from "../../reward/reward.model";
import { IStatus } from "../../user/user.interface";

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