import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { USER_ROLE } from "../user/user.interface";
import { RewardConroller } from "./reward.controller";

const router = Router()
// User can seee their Active Reward
router.route("/:type")
    .get(checkAuth(USER_ROLE.USER), RewardConroller.activeReward)
export const RewardRouter = router;