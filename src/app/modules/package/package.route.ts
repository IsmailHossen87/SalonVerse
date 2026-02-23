import express from 'express';
import { PackageController } from './package.controller';
import { PackageValidation } from './package.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { USER_ROLE } from '../user/user.interface';
import { validateRequest } from '../../middleware/validateRequest';
const router = express.Router();

// create package
router.post('/create', checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), validateRequest(PackageValidation.createPackageSchema), PackageController.createPackage);

// update package
router.patch('/:id', checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), validateRequest(PackageValidation.updatePackageSchema), PackageController.updatePackage);

// delete package
router.delete('/:id', checkAuth(USER_ROLE.OWNER, USER_ROLE.SUPER_ADMIN), PackageController.deletePackage);

// get all packages
router.get('/', PackageController.getAllPackages);

export const PackageRoutes = router;
