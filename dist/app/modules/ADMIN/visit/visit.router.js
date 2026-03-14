"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitRoutes = void 0;
const express_1 = require("express");
const visit_controller_1 = require("./visit.controller");
const checkAuth_1 = require("../../../middleware/checkAuth");
const user_interface_1 = require("../../user/user.interface");
// visit.router.ts
const router = (0, express_1.Router)();
router.route("/")
    .get((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.USER), visit_controller_1.VisitController.getAllVisitRecord);
router.route("/:id")
    .patch((0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER), visit_controller_1.VisitController.confirmVisit);
exports.VisitRoutes = router;
