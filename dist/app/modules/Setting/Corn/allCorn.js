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
exports.startRewardExpireCron = exports.startCheckSubscriptionCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const salon_service_1 = require("../../SUPER_ADMIN/salon/salon.service");
const reward_model_1 = require("../../reward/reward.model");
const user_interface_1 = require("../../user/user.interface");
const startCheckSubscriptionCron = () => node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Daily subscription check started");
    yield (0, salon_service_1.dailySubscriptionCheck)();
}));
exports.startCheckSubscriptionCron = startCheckSubscriptionCron;
const startRewardExpireCron = () => {
    // Every 10 minutes run hobe
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const result = yield reward_model_1.Reward.updateMany({
                expiresAt: { $lt: now },
                isUsed: false,
                status: { $ne: user_interface_1.IStatus.EXPIRED }
            }, {
                $set: { status: user_interface_1.IStatus.EXPIRED }
            });
            console.log(`Expired rewards updated: ${result.modifiedCount}`);
        }
        catch (error) {
            console.error("Reward expire cron error:", error);
        }
    }));
};
exports.startRewardExpireCron = startRewardExpireCron;
