// referral.service.ts
import { UserModel } from "../user/user.model";


const getMyReferralLink = async (userId: string) => {

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    return {
        referralCode: user.referralCode,
    };
};

export const ReferralService = {
    getMyReferralLink
};
