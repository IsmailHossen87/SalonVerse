// referral.router.ts
import { Router } from "express";
import { ReferralController } from "./referral.controller";
import { USER_ROLE } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get(
    "/my-referral-link",
    checkAuth(USER_ROLE.USER),
    ReferralController.getMyReferralLink
);

export const ReferralRouter = router;
