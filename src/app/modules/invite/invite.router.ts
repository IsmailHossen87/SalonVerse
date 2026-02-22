// invite.router.ts
import express from "express";
import { InviteController } from "./invite.controller";

const router = express.Router();

router.post("/complete", InviteController.completeInvite);

export const InviteRoutes = router;
