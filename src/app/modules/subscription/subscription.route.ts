import express from 'express';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionValidations } from './subscription.validation';
import { checkAuth } from '../../middleware/checkAuth';


const router = express.Router();

// create subscription
// router.post('/create', checkAuth(USER_ROLES.USER), validateRequest(SubscriptionValidations.createSubscriptionSchema), SubscriptionController.createSubscription);

export const subscriptionRoutes = router;
