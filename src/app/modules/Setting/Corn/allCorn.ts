import cron from "node-cron";
import { dailySubscriptionCheck } from "../../SUPER_ADMIN/salon/salon.service";

export const startCheckSubscriptionCron = () => cron.schedule("0 0 * * *", async () => {
    console.log("Daily subscription check started");
    await dailySubscriptionCheck();
});