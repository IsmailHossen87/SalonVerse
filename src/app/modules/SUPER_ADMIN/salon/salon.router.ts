// salon.router.ts
import express from "express";
import { salonController } from "./salon.controller";
import catchAsync from "../../../utils/catchAsync";
import { USER_ROLE } from "../../user/user.interface";
import { checkAuth } from "../../../middleware/checkAuth";


const router = express.Router();

router.post("/", checkAuth(USER_ROLE.SUPER_ADMIN), catchAsync(salonController.createSalon));
router.get("/", checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), catchAsync(salonController.getAllSalon));
router.get("/:id", salonController.getSingleSalon);

router.patch("/:id", checkAuth(USER_ROLE.OWNER), catchAsync(salonController.updateSalon));
router.delete("/:id", checkAuth(USER_ROLE.SUPER_ADMIN), catchAsync(salonController.deleteSalon));

export const SalonRoutes = router;
