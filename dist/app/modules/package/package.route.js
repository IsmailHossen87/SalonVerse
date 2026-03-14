"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const package_controller_1 = require("./package.controller");
const package_validation_1 = require("./package.validation");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const router = express_1.default.Router();
// create package
router.post('/create', (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(package_validation_1.PackageValidation.createPackageSchema), package_controller_1.PackageController.createPackage);
// update package
router.patch('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(package_validation_1.PackageValidation.updatePackageSchema), package_controller_1.PackageController.updatePackage);
// delete package
router.delete('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.USER_ROLE.OWNER, user_interface_1.USER_ROLE.SUPER_ADMIN), package_controller_1.PackageController.deletePackage);
// get all packages
router.get('/', package_controller_1.PackageController.getAllPackages);
exports.PackageRoutes = router;
