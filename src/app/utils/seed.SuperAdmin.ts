import { envVar } from "../config/env";
import { IAuthProvider, USER_ROLE } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";
import bcrypt from "bcrypt";


export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await UserModel.findOne({ email: envVar.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return
        }
        console.log("Trying to create Super Admin")


        const hashPassword = await bcrypt.hash(envVar.SUPER_ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUTD))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVar.SUPER_ADMIN_EMAIL
        }

        const payload = {
            name: "Super Admin",
            role: USER_ROLE.SUPER_ADMIN,
            email: envVar.SUPER_ADMIN_EMAIL,
            phoneNumber: "+8801700000000",
            password: hashPassword,
            verified: true,
            auths: [authProvider]
        }

        const superAdmin = await UserModel.create(payload)
        console.log("Super Admin Created Successfully")

    } catch (err) {
        console.log(err)
    }
}