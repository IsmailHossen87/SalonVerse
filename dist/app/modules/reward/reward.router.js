"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const reward_controller_1 = require("./reward.controller");
const router = (0, express_1.Router)();
// User can seee their Active Reward
router.route("/:type")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), reward_controller_1.RewardConroller.activeReward),
    router.route("/:id/:type")
        .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), reward_controller_1.RewardConroller.showAllReward);
exports.RewardRouter = router;
