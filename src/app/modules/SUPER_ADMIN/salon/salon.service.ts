// salon.service.ts
import httpStatus from "http-status-codes";
import { CustomerVisitorModel, SalonModel } from "./salon.model";
import AppError from "../../../errorHalper.ts/AppError";
import { UserModel } from "../../user/user.model";
import { IStatus, USER_ROLE } from "../../user/user.interface";
import { generateHashCode } from "../../../utils/generate";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { visitSalon } from "./visitRecord";

const createSalon = async (payload: any, user: string) => {
    const superAdmin = await UserModel.findById(user);
    if (!superAdmin) {
        throw new AppError(httpStatus.NOT_FOUND, "Super Admin not found");
    }

    if (superAdmin.role !== USER_ROLE.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    const exist = await SalonModel.findOne({ email: payload.email });

    if (exist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Salon already exists");
    }
    const adminInfo = await UserModel.findById(payload.admin);
    if (!adminInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }

    const generateSalonId = await generateHashCode(adminInfo);

    const salon = await SalonModel.create({ ...payload, createdBy: superAdmin._id, salonId: generateSalonId });
    return salon;
};
// daily Subscription Check 
export const dailySubscriptionCheck = async () => {
    const salons = await SalonModel.find();
    salons.forEach(async (salon) => {
        const subscription = await SalonModel.findOne({ _id: salon._id });
        if (subscription) {
            if (subscription.activeStatus === IStatus.ACTIVE) {
                const today = new Date();
                const subscriptionEndDate = new Date(subscription.expiryDate);
                if (today > subscriptionEndDate) {
                    subscription.activeStatus = IStatus.EXPIRED;
                    await subscription.save();
                }
            }
        }
    });
};


const getAllSalon = async (query: any) => {

    const queryBuilder = new QueryBuilder(SalonModel.find().populate("admin", "name email phoneNumber"), query);
    const result = await queryBuilder
        .search(['businessName', 'service', 'city', 'activeStatus'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const [meta, data] = await Promise.all([
        queryBuilder.getMeta(),
        queryBuilder.build(),
    ]);
    if (data.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No purchase history found");
    }
    const allData = await Promise.all(
        data.map(async (salon) => {
            const visitor = await CustomerVisitorModel.countDocuments({ salon: salon._id });
            return { ...salon.toObject(), visitor }
        })
    )

    return { allData, meta };

};

const getSingleSalon = async (id: string, userId: string) => {
    const viwerInfo = await UserModel.findById(userId);
    if (!viwerInfo) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    // 1️⃣ Find the salon and populate admin info
    const salon = await SalonModel.findById(id).populate("admin", "name email phoneNumber");
    if (!salon) {
        throw new AppError(httpStatus.NOT_FOUND, "Salon not found");
    }

    // 2️⃣ Find all visitors for this salon
    const visitors = await CustomerVisitorModel.find({ salon: salon._id }).populate<{ customer: { isOnline: boolean; pointIssued?: number } }>(
        "customer",
        "isOnline pointIssued"
    )
        .lean();

    // 3️⃣ Calculate total points issued
    await visitSalon(salon._id.toString(), viwerInfo._id.toString());          //calculate reward

    // 4️⃣ Calculate total online customers
    const totalOnline = visitors.filter(visitor => visitor.customer?.isOnline).length;

    // 5️⃣ Return summary only
    return {
        ...salon.toObject(),
        // totalPointIssued,
        totalOnline,
    };
};



const updateSalon = async (id: string, payload: any, user: string) => {
    const owner = await UserModel.findById(user);
    if (!owner) {
        throw new AppError(httpStatus.NOT_FOUND, "Owner not found");
    }

    if (owner.role !== USER_ROLE.OWNER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    const salonOwner = await SalonModel.findOne({ admin: owner._id, _id: id });
    if (!salonOwner) {
        throw new AppError(httpStatus.NOT_FOUND, `Salon not found for this ${owner.name}`);
    }

    const salon = await SalonModel.findByIdAndUpdate(salonOwner._id, payload, {
        new: true,
    });

    if (!salon) {
        throw new AppError(httpStatus.NOT_FOUND, "Salon not found");
    }

    return salon;
};

const deleteSalon = async (id: string, user: string) => {
    const superAdmin = await UserModel.findById(user);
    if (!superAdmin) {
        throw new AppError(httpStatus.NOT_FOUND, "Super Admin not found");
    }

    if (superAdmin.role !== USER_ROLE.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    const salon = await SalonModel.findByIdAndUpdate(id, { activeStatus: IStatus.DELETED });

    if (!salon) {
        throw new AppError(httpStatus.NOT_FOUND, "Salon not found");
    }

    return null;
};

export const salonService = {
    createSalon,
    getAllSalon,
    getSingleSalon,
    updateSalon,
    deleteSalon,
};
