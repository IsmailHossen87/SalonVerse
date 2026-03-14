import { Types } from "twilio/lib/rest/content/v1/content";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { PointIssuedHistory, ViewReward } from "../../reward/reward.model";
import { UserModel } from "../../user/user.model";
import { SalonModel } from "../../SUPER_ADMIN/salon/salon.model";
import AppError from "../../../errorHalper.ts/AppError";
import httpStatus from "http-status-codes";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { firebaseNotificationBuilder } from "../../../shared/sendNotification";
import { INOTIFICATION_EVENT, INOTIFICATION_TYPE, IREFERENCE_TYPE } from "../../notification/notification.interface";
import { saveNotification, socketHelper } from "../../../helpers/socketHelper";

// visit.service.ts
const getAllVisitRecord = async (query: any) => {
    const { userId, salonId, ...rest } = query;
    const mongoQuery: any = {}

    if (userId) {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        mongoQuery.userId = user._id
    }
    if (salonId) {
        const salon = await SalonModel.findById(salonId)
        if (!salon) {
            throw new Error("Salon not found")
        }
        mongoQuery.salonId = salon._id
    }

    const result = ViewReward.find(mongoQuery).populate("userId", "name  phoneNumber").populate("salonId", "service businessName location").sort({ updatedAt: -1 });

    const queryBuilder = new QueryBuilder(result, rest)
        .search(['name'])
        .filter()
        .limit()
        .paginate()

    const [meta, data] = await Promise.all([
        queryBuilder.getMeta(),
        queryBuilder.build(),
    ]);
    if (data.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No visit history found");
    }

    console.log(data)

    const resultData = data?.map((item: any) => {
        return {
            user: item.userId.name || 'N/A',
            userId: item.userId._id,
            rewardId: item._id,
            lastView: item.lastVisitAt,
            totalVisit: item.totalVisit,
            salonName: item.salonId.businessName,
            location: item.salonId.location,
            totalPoint: item.pendingCoins,
            serviceName: item.salonId.service,
            status: item.status,
        }
    })


    return { meta, data: resultData }
}

const approveVisitCoin = async (id: string, userId: string) => {
    const visit = await ViewReward.findById(id);
    if (!visit) throw new AppError(httpStatus.NOT_FOUND, "Visit not found");

    const rewardOwner = await UserModel.findById(visit.userId);
    if (!rewardOwner) throw new AppError(httpStatus.NOT_FOUND, "Reward owner not found");

    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    if (user.role !== USER_ROLE.OWNER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not Owner");
    }

    let status = ''
    if (visit.status === IStatus.PENDING) {
        status = IStatus.APPROVED

        await rewardOwner.updateOne({ $inc: { coins: visit.pendingCoins } })
        await visit.updateOne({ pendingCoins: 0 })

    }
    await visit.updateOne({ status })
    // realtime notification for admin
    socketHelper.emit("notification", {
        receiver: rewardOwner._id,
        title: "Reward Claimed",
        message: `${visit.pendingCoins} claimed successfully`,
        type: "INVITE_REWARD",
    });
    await saveNotification({
        receiverId: rewardOwner._id,
        title: "View Reward Claimed",
        body: `${visit.pendingCoins} claimed successfully`,
        notificationEvent: INOTIFICATION_EVENT.PURCHASE_REWARD,
        notificationType: INOTIFICATION_TYPE.NOTIFICATION,
        referenceId: visit._id,
        referenceType: IREFERENCE_TYPE.USER,
        read: false,
    });
    return visit
}



export const VisitService = {
    getAllVisitRecord,
    approveVisitCoin
}
