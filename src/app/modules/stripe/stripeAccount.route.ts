import { Router } from 'express';
import { stripeAccountController } from './stripeAccount.controller';
import { USER_ROLE } from '../user/user.interface';
import { checkAuth } from '../../middleware/checkAuth';
import { check } from 'zod';


// import { auth } from "../../middlewares/auth.js";

const stripeAccountRoutes = Router();
stripeAccountRoutes.post('/connected-user/login-link', checkAuth(USER_ROLE.USER), stripeAccountController.stripeLoginLink);
stripeAccountRoutes
     .post('/create-connected-account', checkAuth(USER_ROLE.USER), stripeAccountController.createStripeAccount)
     .get('/success-account/:id', stripeAccountController.successPageAccount)
     .get('/refreshAccountConnect/:id', stripeAccountController.refreshAccountConnect);

stripeAccountRoutes.get('/success-account/:accountId', stripeAccountController.onConnectedStripeAccountSuccess);


export default stripeAccountRoutes;
