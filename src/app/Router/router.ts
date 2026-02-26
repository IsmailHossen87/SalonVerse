import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { SalonRoutes } from "../modules/SUPER_ADMIN/salon/salon.router";
import { authRouter } from "../modules/auth/auth.router";
import { RuleRoute } from "../modules/Setting/rule/rule.route";
import { InviteRoutes } from "../modules/invite/invite.router";
import { ReferralRouter } from "../modules/referral/referral.router";
import { salonRewardRouter } from "../modules/ADMIN/salonReward/salonReward.router";
import { VisitRoutes } from "../modules/ADMIN/visit/visit.router";
import { CustomerRoutes } from "../modules/ADMIN/customer/customer.router";

const router = Router();


const apiRoutes = [
    {
        path: "/user",
        router: userRouter
    },
    {
        path: "/auth",
        router: authRouter
    },
    {
        path: "/salon",
        router: SalonRoutes
    }, {
        path: "/rule",
        router: RuleRoute
    },
    {
        path: "/invite",
        router: InviteRoutes
    },
    {
        path: "/referral",
        router: ReferralRouter
    },
    {
        path: "/salon-reward",
        router: salonRewardRouter
    },
    {
        path: "/visit",
        router: VisitRoutes
    },
    {
        path: "/customer",
        router: CustomerRoutes
    }
]




apiRoutes.forEach((route) => {
    router.use(route.path, route.router)
})

export default router;