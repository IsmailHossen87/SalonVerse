import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { USER_ROLE } from "./user.interface";
import fileUploadHandler from "../../middleware/fileUploadHandlare";
import { parseFormDataMiddleware } from "../../middleware/parseFromData";



// user.router.ts
const router = Router();
const allUser = [USER_ROLE.SUPER_ADMIN, USER_ROLE.USER];

// ✅ নতুন route: OTP পাঠানো
router.post("/send-otp", userController.sendOTP);

router
    .route("/")
    .get(checkAuth(USER_ROLE.SUPER_ADMIN), userController.getAllUser)
    .patch(checkAuth(...allUser), fileUploadHandler(), parseFormDataMiddleware, userController.updateUser)
    .post(fileUploadHandler(), parseFormDataMiddleware, userController.createUser);

router.route("/:id").get(checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.USER), userController.userDetails);
router.route("/delete").delete(checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.USER), userController.deleteUser);

export const userRouter = router;