"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRoute = void 0;
const express_1 = __importDefault(require("express"));
const rule_controller_1 = require("./rule.controller");
const checkAuth_1 = require("../../../middleware/checkAuth");
const user_interface_1 = require("../../user/user.interface");
const router = express_1.default.Router();
router
    .route('/global')
    .put((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), rule_controller_1.RuleController.globalRule);
router.route("/tire")
    .post((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), rule_controller_1.RuleController.tireRule)
    .get(rule_controller_1.RuleController.allTire);
router.route("/smart").put((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), rule_controller_1.RuleController.smartRule);
router.route("/reward").put((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), rule_controller_1.RuleController.rewardRule);
router.route("/:ruleType").get(rule_controller_1.RuleController.getRule);
// router
//      .route('/content')
//      .patch(validateRequest(RuleValidation.contentZodSchema), checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.upsertContent)
//      .get(validateRequest(RuleValidation.contentZodSchema), RuleController.getContent);
// router
//      .route('/value')
//      .patch(validateRequest(RuleValidation.valuesZodSchema), checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.upsertValuse)
//      .get(validateRequest(RuleValidation.valuesZodSchema), RuleController.getValue);
// // router
//      .route('/social-media')
// .post(validateRequest(RuleValidation.socialMediaZodSchema), auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RuleController.createSocialMedia)
// .get(validateRequest(RuleValidation.socialMediaZodSchema), RuleController.getSocialMedia);
exports.RuleRoute = router;
