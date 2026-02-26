import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { USER_ROLE } from "../../user/user.interface";
import { CustomerController } from "./customer.controller";

// customer.router.ts
const router = Router();

router.route("/")
    .get(checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), CustomerController.getAllCustomer)


router.route("/:id")
    .get(checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), CustomerController.singleUser)



export const CustomerRoutes = router;