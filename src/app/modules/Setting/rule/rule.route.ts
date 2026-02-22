import express from 'express';
import { RuleController } from './rule.controller';
import { RuleValidation } from './rule.validation';
import { validateRequest } from '../../../middleware/validateRequest';
import { checkAuth } from '../../../middleware/checkAuth';
import { USER_ROLE } from '../../user/user.interface';

const router = express.Router();

router
     .route('/global')
     .put(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.globalRule)

router.route("/smart").put(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.smartRule)
router.route("/reward").put(checkAuth(USER_ROLE.SUPER_ADMIN), RuleController.rewardRule)

router.route("/:ruleType").get(RuleController.getRule)

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

export const RuleRoute = router;
