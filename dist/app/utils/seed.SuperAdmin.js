"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.UserModel.findOne({ email: env_1.envVar.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin");
        const hashPassword = yield bcrypt_1.default.hash(env_1.envVar.SUPER_ADMIN_PASSWORD, Number(env_1.envVar.BCRYPT_SALT_ROUTD));
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVar.SUPER_ADMIN_EMAIL
        };
        const payload = {
            name: "Super Admin",
            role: user_interface_1.USER_ROLE.SUPER_ADMIN,
            email: env_1.envVar.SUPER_ADMIN_EMAIL,
            phoneNumber: "+8801700000000",
            password: hashPassword,
            verified: true,
            auths: [authProvider]
        };
        const superAdmin = yield user_model_1.UserModel.create(payload);
        console.log("Super Admin Created Successfully");
    }
    catch (err) {
        console.log(err);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
