import { Router } from "express";

import { USER_ROLE } from "../../user/user.interface";
import { AnalysisController } from "./analysis.controller";
import { checkAuth } from "../../../middleware/checkAuth";

// analysis.router.ts
const router = Router()

// GET Salon history with metrics, chart, insights
router.get(
    '/salon-history/:salonId',
    checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.OWNER),
    AnalysisController.getSalonHistory
);

// GET All Salons (with search, filter, pagination + visit/customer stats)
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

// GET Top Performing Salons (by customer engagement / points)
router.get(
    '/top-performing-salons',
    checkAuth(USER_ROLE.SUPER_ADMIN),
    AnalysisController.getTopPerformingSalons
);

export const AnalysisRoutes = router
