import express from 'express';
import { RuleController } from './rule.controller';
import { checkAuth } from '../../../middleware/checkAuth';
import { USER_ROLE } from '../../user/user.interface';

const router = express.Router();

router
     .route('/global')
     .put(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.globalRule)

router.route("/tire")
     .post(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.tireRule)
     .get(RuleController.allTire)

router.route("/tire/:id")
     .patch(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.updateTire)
router.route("/tire-is-active/:id").patch(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.tireIsActive)

router.route("/smart").put(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.smartRule)
router.route("/smart/:id").patch(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.updateSmartRule)


// Time & Day Reward Rules
router.route("/time-day-rule")
     .post(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.createTimeDayRule)
     .get(RuleController.getAllTimeDayRules)

router.route("/time-day-rule/:id")
     .patch(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.toggleTimeDayRule)
     .delete(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.deleteTimeDayRule)

router.route("/:ruleType").get(RuleController.getRule)

export const RuleRoute = router;

