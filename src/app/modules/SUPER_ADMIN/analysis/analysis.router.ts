import { Router } from "express";

import { USER_ROLE } from "../../user/user.interface";
import { AnalysisController } from "./analysis.controller";
import { checkAuth } from "../../../middleware/checkAuth";

const router = Router()

router.get(
    '/salon-history/:salonId',
    checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER),
    AnalysisController.getSalonHistory
);
router.get(
    '/salons',
    checkAuth(USER_ROLE.SUPER_ADMIN),
    AnalysisController.getAllSalons
);

// GET Top Service Usage Ranking
router.get(
    '/top-services',
    checkAuth(USER_ROLE.SUPER_ADMIN),
    AnalysisController.getTopServiceUsageRanking
);

router.get(
    '/top-performing-salons',
    checkAuth(USER_ROLE.SUPER_ADMIN),
    AnalysisController.getTopPerformingSalons
);

export const AnalysisRoutes = router
