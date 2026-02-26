import { Router } from "express";
import { VisitController } from "./visit.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { USER_ROLE } from "../../user/user.interface";

// visit.router.ts
const router = Router();

router.route("/")
    .get(checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER, USER_ROLE.USER), VisitController.getAllVisitRecord)

router.route("/:id")
    .post(checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), VisitController.confirmVisit)




export const VisitRoutes = router;