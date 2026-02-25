// salon.router.ts
import express from "express";
import { salonController } from "./salon.controller";
import catchAsync from "../../../utils/catchAsync";
import { USER_ROLE } from "../../user/user.interface";
import { checkAuth } from "../../../middleware/checkAuth";
import fileUploadHandler from "../../../middleware/fileUploadHandlare";
import { parseFormDataMiddleware } from "../../../middleware/parseFromData";


const router = express.Router();

router.post("/", checkAuth(USER_ROLE.SUPER_ADMIN), catchAsync(salonController.createSalon));
router.get("/", checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER), catchAsync(salonController.getAllSalon));
router.get("/:id", checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.USER, USER_ROLE.OWNER), catchAsync(salonController.getSingleSalon));

router.patch("/:id", checkAuth(USER_ROLE.OWNER),
    fileUploadHandler(),
    parseFormDataMiddleware,
    catchAsync(salonController.updateSalon));
router.delete("/:id", checkAuth(USER_ROLE.SUPER_ADMIN), catchAsync(salonController.deleteSalon));

export const SalonRoutes = router;
