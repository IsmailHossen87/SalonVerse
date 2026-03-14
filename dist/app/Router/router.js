"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const salon_router_1 = require("../modules/SUPER_ADMIN/salon/salon.router");
const auth_router_1 = require("../modules/auth/auth.router");
const rule_route_1 = require("../modules/Setting/rule/rule.route");
const referral_router_1 = require("../modules/referral/referral.router");
const salonReward_router_1 = require("../modules/ADMIN/salonReward/salonReward.router");
const visit_router_1 = require("../modules/ADMIN/visit/visit.router");
const customer_router_1 = require("../modules/ADMIN/customer/customer.router");
const dashboard_router_1 = require("../modules/ADMIN/dashboard/dashboard.router");
const reward_router_1 = require("../modules/reward/reward.router");
const notification_router_1 = require("../modules/notification/notification.router");
const router = (0, express_1.Router)();
const apiRoutes = [
    {
        path: "/user",
        router: user_router_1.userRouter
    },
    {
        path: "/auth",
        router: auth_router_1.authRouter
    },
    {
        path: "/salon",
        router: salon_router_1.SalonRoutes
    }, {
        path: "/rule",
        router: rule_route_1.RuleRoute
    },
    {
        path: "/referral",
        router: referral_router_1.ReferralRouter
    },
    {
        path: "/salon-reward",
        router: salonReward_router_1.salonRewardRouter
    },
    {
        path: "/visit",
        router: visit_router_1.VisitRoutes
    },
    {
        path: "/customer",
        router: customer_router_1.CustomerRoutes
    },
    {
        path: "/dashboard",
        router: dashboard_router_1.DashboardRouter
    },
    {
        path: "/reward",
        router: reward_router_1.RewardRouter
    },
    {
        path: "/notification",
        router: notification_router_1.notificationRouter
    }
];
apiRoutes.forEach((route) => {
    router.use(route.path, route.router);
});
exports.default = router;
