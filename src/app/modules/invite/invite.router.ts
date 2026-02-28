// // invite.router.ts
// import express from "express";
// import { InviteController } from "./invite.controller";
// import { checkAuth } from "../../middleware/checkAuth";
// import { USER_ROLE } from "../user/user.interface";

// const router = express.Router();

// router.post("/complete", checkAuth(USER_ROLE.USER), InviteController.completeInvite);

// export const InviteRoutes = router;
