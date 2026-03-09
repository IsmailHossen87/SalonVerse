import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { USER_ROLE } from "../../user/user.interface";
import { salonRewardController } from "./salonReward.controller";
import fileUploadHandler from "../../../middleware/fileUploadHandlare";
import { parseFormDataMiddleware } from "../../../middleware/parseFromData";
import catchAsync from "../../../utils/catchAsync";

// reward.router.ts
const router = Router();
router.route("/")
    .post(checkAuth(USER_ROLE.OWNER),
        fileUploadHandler(),
        parseFormDataMiddleware,
        catchAsync(salonRewardController.createSalonReward))
    .get(catchAsync(salonRewardController.getAllSalonReward));

//  Redemption like Reward Approve and get
router.route("/redemption")
    .get(checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER), catchAsync(salonRewardController.getAllRedemption))

router.route("/global-reward")
    .get(checkAuth(USER_ROLE.USER), catchAsync(salonRewardController.globalReward))

router.route("/purchase-reward-history")
    .get(checkAuth(USER_ROLE.USER), catchAsync(salonRewardController.getPurchaseRewardHistory))

router.route("/claim/:id")
    .post(checkAuth(USER_ROLE.USER), catchAsync(salonRewardController.claimReward))

router.get("/purchase-view-history/:id", checkAuth(USER_ROLE.USER), catchAsync(salonRewardController.getViewHistory))  //after view and admin approved




router.route("/:id")
    .get(checkAuth(USER_ROLE.OWNER, USER_ROLE.USER, USER_ROLE.SUPER_ADMIN), catchAsync(salonRewardController.getSingleSalonReward))
    .patch(checkAuth(USER_ROLE.OWNER), fileUploadHandler(), parseFormDataMiddleware, catchAsync(salonRewardController.updateSalonReward))


router.route("/approve/:id")
    .patch(checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), catchAsync(salonRewardController.approveRedemption))




export const salonRewardRouter = router;