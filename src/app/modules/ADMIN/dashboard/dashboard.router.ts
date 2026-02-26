import { Router } from "express";
import { USER_ROLE } from "../../user/user.interface";
import { DashboardController } from "./dashboard.controller";
import { checkAuth } from "../../../middleware/checkAuth";

// dashboard.router.ts
const router = Router()

router.route("/").
    get(checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), DashboardController.getDashboard)

export const DashboardRouter = router;