// referral.service.ts

import { envVar } from "../../config/env";
import { UserModel } from "../user/user.model";


const getMyReferralLink = async (userId: string) => {

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const referralLink = `${envVar.FRONTEND_URL}/signup?ref=${user.referralCode}`;

    return {
        referralCode: user.referralCode,
        referralLink
    };
};

export const ReferralService = {
    getMyReferralLink
};
