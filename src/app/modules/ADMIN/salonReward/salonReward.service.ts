import AppError from "../../../errorHalper.ts/AppError";
import { UserModel } from "../../user/user.model";
import httpStatus from "http-status-codes";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { RewardSalonModel } from "./salonReward.model";
import { SalonModel } from "../../SUPER_ADMIN/salon/salon.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import unlinkFile from "../../../shared/unLinkFile";
import { PurchaseReward } from "../../reward/reward.model";
// reward.service.ts
const createReward = async (payload: any, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role !== USER_ROLE.OWNER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    const salon = await SalonModel.findOne({ admin: user._id });
    if (!salon) {
        throw new AppError(httpStatus.NOT_FOUND, "Salon not found");
    }
    const reward = await RewardSalonModel.create({ ...payload, ownerId: user._id, salonId: salon._id });
    return reward;
}

const getAllSalonReward = async (query: any) => {
    const { salons, ...rest } = query
    let mongoQuery: any = {}

    if (salons) {
        const salonIds = salons.split(",")
        mongoQuery.salonId = { $in: salonIds }
    }
    const reward = RewardSalonModel.find(mongoQuery)

    const queryBuilder = new QueryBuilder(reward, rest)
        .search(["rewardName", "service", "description", "redemptionPolicy", "rewardStatus"])
        .filter()
        .sort()
        .paginate()
        .fields()

    const [data, meta] = await Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);

    return { data, meta }

}

const getSingleSalonReward = async (id: string, userId: string) => {
    const reward = await RewardSalonModel.findById(id);
    const visitorUser = await UserModel.findById(userId)
    if (!visitorUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (!reward) {
        throw new AppError(httpStatus.NOT_FOUND, "Reward not found");
    }
    return { ...reward.toObject(), VisitorCoin: visitorUser?.coins || 0 };
}

const updateSalonReward = async (id: string, payload: any) => {

    const rewardInfo = await RewardSalonModel.findById(id);
    if (!rewardInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "Reward not found");
    }

    if (payload.rewardImage && rewardInfo.rewardImage) {
        await unlinkFile(rewardInfo.rewardImage);
    }



    const reward = await RewardSalonModel.findByIdAndUpdate(id, payload, { new: true });
    return reward;
}


const claimReward = async (id: string, userId: string) => {
    const reward = await RewardSalonModel.findById(id);
    const visitorUser = await UserModel.findById(userId)
    if (!visitorUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (!reward) {
        throw new AppError(httpStatus.NOT_FOUND, "Reward not found");
    }

    await PurchaseReward.create({
        rewardId: reward._id,
        userId: visitorUser._id,
        salonId: reward.salonId,
        pointCost: reward.rewardPoints
    });

    await UserModel.findByIdAndUpdate(visitorUser._id, {
        $inc: { coins: -reward.rewardPoints }
    });

    return `${reward.rewardName} claimed successfully`;
}


// RDDEMPTION 

const getAllRedemption = async (query: any, userId: string) => {
    const { phone, rewardName, ...rest } = query

    let mongoQuery: any = {}

    if (phone) {
        const user = await UserModel.findOne({ phoneNumber: phone });
        if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
        mongoQuery.userId = user._id;
    }
    if (rewardName) {
        const reward = await RewardSalonModel.findOne({ rewardName: rewardName });
        if (reward) {
            mongoQuery.rewardId = reward._id;
        }
    }
    const reward = PurchaseReward.find(mongoQuery).populate({ path: "rewardId", select: "rewardName rewardPoints" }).populate({ path: "userId", select: "phoneNumber" })

    const queryBuilder = new QueryBuilder(reward, rest)
        .search(["status"])
        .filter()
        .sort()
        .paginate()
        .fields()

    const [data, meta] = await Promise.all([
        queryBuilder.build(), queryBuilder.getMeta()
    ]);

    if (data.length < 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No data found");
    }


    const result = data.map((item: any) => {
        return {
            _id: item._id,
            rewardName: item.rewardId.rewardName,
            rewardPoints: item.rewardId.rewardPoints,
            phoneNumber: item.userId.phoneNumber,
            status: item.status,
            createdAt: item.createdAt,
        }
    })

    const coundPending = await PurchaseReward.countDocuments({ status: IStatus.PENDING })
    const coundApproved = await PurchaseReward.countDocuments({ status: IStatus.APPROVED })
    const coundRejected = await PurchaseReward.countDocuments({ status: IStatus.REJECTED })
    const totalPointReedem = await PurchaseReward.aggregate([
        {
            $match: { status: IStatus.APPROVED }
        },
        {
            $lookup: {
                from: "rewardsalons",
                localField: "rewardId",
                foreignField: "_id",
                as: "rewardId"
            }
        },
        {
            $unwind: "$rewardId"
        },
        {
            $group: {
                _id: null,
                totalPointReedem: { $sum: "$rewardId.rewardPoints" }
            }
        }
    ])


    return {
        data: result,
        meta,
        statusCount: {
            pending: coundPending,
            approved: coundApproved,
            rejected: coundRejected,
            totalPointReedem: totalPointReedem[0]?.totalPointReedem || 0
        }
    }

}

const approveRedemption = async (id: string, userId: string) => {
    const reward = await PurchaseReward.findById(id);
    if (!reward) throw new AppError(httpStatus.NOT_FOUND, "Reward not found");
    const rewardInfo = await RewardSalonModel.findById(reward?.rewardId);

    if (rewardInfo?.ownerId.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    let status = "";
    if (reward.status === IStatus.PENDING) {
        status = IStatus.APPROVED;
    } else if (reward.status === IStatus.APPROVED) {
        status = IStatus.REJECTED;
    } else {
        status = IStatus.APPROVED;
    }

    await PurchaseReward.findByIdAndUpdate(id, { status });

    if (status === IStatus.APPROVED) {
        await UserModel.findByIdAndUpdate(reward.userId, {
            $inc: { coins: rewardInfo.rewardPoints }
        });
    } else if (status === IStatus.REJECTED) {
        await UserModel.findByIdAndUpdate(reward.userId, {
            $inc: { coins: -rewardInfo.rewardPoints }
        });
    }

    return `Reward ${status} successfully`;
}



export const salonRewardService = {
    createReward,
    getAllSalonReward,
    getSingleSalonReward,
    updateSalonReward,
    claimReward,
    approveRedemption,
    getAllRedemption
}