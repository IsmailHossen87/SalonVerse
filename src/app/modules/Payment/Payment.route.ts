import { Router } from "express"

import { PaymentController } from "./paymentController"
import { USER_ROLE } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";
// import { handlePayment } from "../../../handlers/handlePaymentSuccess";


const router = Router()

router.route("/buy-credit/:id").post(checkAuth(USER_ROLE.USER), PaymentController.buyMoneyCredits)

router.get('/success', PaymentController.paymentSuccess);
router.get('/cancel', PaymentController.paymentCancel);



export const PaymentRouter = router