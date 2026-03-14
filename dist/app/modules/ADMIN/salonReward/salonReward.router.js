"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salonRewardRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../../middleware/checkAuth");
const user_interface_1 = require("../../user/user.interface");
const salonReward_controller_1 = require("./salonReward.controller");
const fileUploadHandlare_1 = __importDefault(require("../../../middleware/fileUploadHandlare"));
const parseFromData_1 = require("../../../middleware/parseFromData");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
// reward.router.ts
const router = (0, express_1.Router)();
router.route("/")
    .post((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER), (0, fileUploadHandlare_1.default)(), parseFromData_1.parseFormDataMiddleware, (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.createSalonReward))
    .get((0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.getAllSalonReward));
//  Redemption like Reward Approve and get
router.route("/redemption")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.getAllRedemption));
router.route("/global-reward")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.globalReward));
router.route("/purchase-reward-history")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.getPurchaseRewardHistory));
router.route("/claim/:id")
    .post((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.claimReward));
router.get("/purchase-view-history/:id", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.getViewHistory)); //after view and admin approved
router.route("/:id")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.getSingleSalonReward))
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER), (0, fileUploadHandlare_1.default)(), parseFromData_1.parseFormDataMiddleware, (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.updateSalonReward));
router.route("/approve/:id")
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, catchAsync_1.default)(salonReward_controller_1.salonRewardController.approveRedemption));
exports.salonRewardRouter = router;
