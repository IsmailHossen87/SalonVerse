import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { USER_ROLE } from "../user/user.interface";
import { RewardConroller } from "./reward.controller";

const router = Router()
// User can seee their Active Reward
router.route("/:type")
    .get(checkAuth(USER_ROLE.USER, USER_ROLE.OWNER), RewardConroller.activeReward),
    router.route("/:id/:type")
        .get(checkAuth(USER_ROLE.USER, USER_ROLE.OWNER), RewardConroller.showAllReward)
export const RewardRouter = router;