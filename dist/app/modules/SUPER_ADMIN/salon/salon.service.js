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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salonService = exports.dailySubscriptionCheck = void 0;
// salon.service.ts
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const salon_model_1 = require("./salon.model");
const AppError_1 = __importDefault(require("../../../errorHalper.ts/AppError"));
const user_model_1 = require("../../user/user.model");
const user_interface_1 = require("../../user/user.interface");
const generate_1 = require("../../../utils/generate");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const visitRecord_1 = require("./visitRecord");
const reward_model_1 = require("../../reward/reward.model");
const salonReward_model_1 = require("../../ADMIN/salonReward/salonReward.model");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../../config/env");
const distance_1 = require("./distance");
const createSalon = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const superAdmin = yield user_model_1.UserModel.findById(user);
    if (!superAdmin) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Super Admin not found");
    }
    if (superAdmin.role !== user_interface_1.USER_ROLE.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const exist = yield salon_model_1.SalonModel.findOne({ email: payload.email });
    if (exist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Salon already exists");
    }
    const adminInfo = yield user_model_1.UserModel.findById(payload.admin);
    if (!adminInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const generateSalonId = yield (0, generate_1.generateHashCode)(adminInfo);
    const salon = yield salon_model_1.SalonModel.create(Object.assign(Object.assign({}, payload), { createdBy: superAdmin._id, salonId: generateSalonId }));
    return salon;
});
// daily Subscription Check 
const dailySubscriptionCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    const salons = yield salon_model_1.SalonModel.find();
    salons.forEach((salon) => __awaiter(void 0, void 0, void 0, function* () {
        const subscription = yield salon_model_1.SalonModel.findOne({ _id: salon._id });
        if (subscription) {
            if (subscription.activeStatus === user_interface_1.IStatus.ACTIVE) {
                const today = new Date();
                const subscriptionEndDate = new Date(subscription.expiryDate);
                if (today > subscriptionEndDate) {
                    subscription.activeStatus = user_interface_1.IStatus.EXPIRED;
                    yield subscription.save();
                }
            }
        }
    }));
});
exports.dailySubscriptionCheck = dailySubscriptionCheck;
const getAllSalon = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat1, lon1 } = query, rest = __rest(query, ["lat1", "lon1"]);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(salon_model_1.SalonModel.find().populate("admin", "name email phoneNumber"), rest);
    const result = yield queryBuilder
        .search(['businessName', 'service', 'city', 'activeStatus'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const [meta, data] = yield Promise.all([
        queryBuilder.getMeta(),
        queryBuilder.build(),
    ]);
    if (data.length === 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No purchase history found");
    }
    const allData = yield Promise.all(data.map((salon) => __awaiter(void 0, void 0, void 0, function* () {
        const visitor = yield reward_model_1.ViewReward.countDocuments({ salonId: salon._id });
        return Object.assign(Object.assign({}, salon.toObject()), { visitor });
    })));
    const injectIsRewardAvailable = yield Promise.all(allData.map((salon) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const reward = yield salonReward_model_1.RewardSalonModel.findOne({ salonId: salon._id });
        let distance = null;
        if (lat1 && lon1) {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${Number(lat1)},${Number(lon1)}&destinations=${Number(salon.lat)},${Number(salon.lon)}&key=${env_1.envVar.GOOGLE_MAP_KEY}`);
            const element = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.rows) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.elements) === null || _d === void 0 ? void 0 : _d[0];
            if ((element === null || element === void 0 ? void 0 : element.status) === "OK") {
                distance = element.distance.text;
            }
        }
        return Object.assign(Object.assign({}, salon), { isRewardAvailable: !!reward, distance });
    })));
    return { allData: injectIsRewardAvailable, meta };
});
const updateSalon = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield user_model_1.UserModel.findById(user);
    if (!owner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Owner not found");
    }
    if (owner.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const salonOwner = yield salon_model_1.SalonModel.findOne({ admin: owner._id });
    if (!salonOwner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Salon not found for this ${owner.name}`);
    }
    const salon = yield salon_model_1.SalonModel.findByIdAndUpdate(salonOwner._id, payload, {
        new: true,
    });
    if (!salon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
    }
    return salon;
});
const deleteSalon = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const superAdmin = yield user_model_1.UserModel.findById(user);
    if (!superAdmin) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Super Admin not found");
    }
    if (superAdmin.role !== user_interface_1.USER_ROLE.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const salon = yield salon_model_1.SalonModel.findByIdAndUpdate(id, { activeStatus: user_interface_1.IStatus.DELETED });
    if (!salon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
    }
    return null;
});
const getSingleSalon = (id, userId, lat1, lon1) => __awaiter(void 0, void 0, void 0, function* () {
    const viwerInfo = yield user_model_1.UserModel.findById(userId);
    if (!viwerInfo)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    // 1️⃣ Find the salon and populate admin info
    const salon = yield salon_model_1.SalonModel.findById(id).populate("admin", "name email phoneNumber");
    if (!salon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
    }
    // 2️⃣ Find all visitors for this salon
    const visitors = yield reward_model_1.ViewReward.find({ salonId: salon._id }).populate("userId", "isOnline ")
        .lean();
    let distance = 0;
    if (lat1 && lon1) {
        distance = (0, distance_1.getDistance)(lat1, lon1, salon.lat, salon.lon);
    }
    // 4️⃣ Calculate total online customers
    const totalOnline = visitors.filter((visitor) => { var _a; return (_a = visitor.userId) === null || _a === void 0 ? void 0 : _a.isOnline; }).length;
    // 5️⃣ Return summary only
    return Object.assign(Object.assign({}, salon.toObject()), { totalOnline,
        distance });
});
const getSalonSetting = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield user_model_1.UserModel.findById(user);
    console.log("OWNER", owner);
    if (!owner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Owner not found");
    }
    if (owner.role !== user_interface_1.USER_ROLE.OWNER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const salonOwner = yield salon_model_1.SalonModel.findOne({ admin: owner._id });
    console.log("SALONWONER", salonOwner);
    if (!salonOwner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Salon not found for this ${owner.name}`);
    }
    return salonOwner;
});
const visitConfirm = (id, user, lat1, lon1) => __awaiter(void 0, void 0, void 0, function* () {
    const viwerInfo = yield user_model_1.UserModel.findById(user);
    if (!viwerInfo)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    // 1️⃣ Find the salon and populate admin info
    const salon = yield salon_model_1.SalonModel.findById(id).populate("admin", "name email phoneNumber");
    if (!salon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Salon not found");
    }
    const checkTodayVisitSalon = yield reward_model_1.PointIssuedHistory.find({ salonId: salon._id, userId: user, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    if (checkTodayVisitSalon.length > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already visited this salon today");
    }
    // 2️⃣ Find all visitors for this salon
    const visitors = yield reward_model_1.ViewReward.find({ salonId: salon._id }).populate("userId", "isOnline ")
        .lean();
    let distance = 0;
    if (lat1 && lon1) {
        distance = (0, distance_1.getDistance)(lat1, lon1, salon.lat, salon.lon);
    }
    if (distance * 1000 > 50) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are too far from the salon. You must be within 50 meters.");
    }
    // 3️⃣ Calculate total points issued
    yield (0, visitRecord_1.visitSalon)(salon._id.toString(), viwerInfo._id.toString());
    // 5️⃣ Return summary only
    return { message: "Visit confirmed successfully" };
});
const salonMenagement = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield user_model_1.UserModel.findById(user);
    if (!owner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Owner not found");
    }
    if (owner.role !== user_interface_1.USER_ROLE.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const activeSalon = yield salon_model_1.SalonModel.countDocuments({ activeStatus: user_interface_1.IStatus.ACTIVE });
    const totalUser = yield user_model_1.UserModel.countDocuments({ role: user_interface_1.USER_ROLE.USER });
    const expiringSoon = yield salon_model_1.SalonModel.find({
        subscriptionEndDate: {
            $gte: new Date(),
            $lt: new Date(new Date().setDate(new Date().getDate() + 30))
        }
    }).select("businessName");
    const totalExpiringSoon = expiringSoon.length;
    return { activeSalon, totalUser, totalExpiringSoon };
});
exports.salonService = {
    createSalon,
    getAllSalon,
    getSingleSalon,
    updateSalon,
    deleteSalon,
    visitConfirm,
    getSalonSetting,
    salonMenagement
};
