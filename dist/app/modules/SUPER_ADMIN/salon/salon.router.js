"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonRoutes = void 0;
// salon.router.ts
const express_1 = __importDefault(require("express"));
const salon_controller_1 = require("./salon.controller");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const user_interface_1 = require("../../user/user.interface");
const checkAuth_1 = require("../../../middleware/checkAuth");
const fileUploadHandlare_1 = __importDefault(require("../../../middleware/fileUploadHandlare"));
const parseFromData_1 = require("../../../middleware/parseFromData");
const router = express_1.default.Router();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), (0, catchAsync_1.default)(salon_controller_1.salonController.createSalon));
router.patch("/setting", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER), (0, fileUploadHandlare_1.default)(), parseFromData_1.parseFormDataMiddleware, (0, catchAsync_1.default)(salon_controller_1.salonController.updateSalon));
router.get("/setting", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER), (0, catchAsync_1.default)(salon_controller_1.salonController.getSalonSetting));
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salon_controller_1.salonController.getAllSalon));
router.get("/salon-menagement", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), (0, catchAsync_1.default)(salon_controller_1.salonController.salonMenagement));
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.USER, user_interface_1.USER_ROLE.OWNER), (0, catchAsync_1.default)(salon_controller_1.salonController.getSingleSalon));
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.SUPER_ADMIN), (0, catchAsync_1.default)(salon_controller_1.salonController.deleteSalon));
router.post("/visit-confirm/:id", (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.USER), (0, catchAsync_1.default)(salon_controller_1.salonController.visitConfirm));
exports.SalonRoutes = router;
