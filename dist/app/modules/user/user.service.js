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
exports.userService = exports.createUser = void 0;
const AppError_1 = __importDefault(require("../../errorHalper.ts/AppError"));
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("./user.interface");
const unLinkFile_1 = __importDefault(require("../../shared/unLinkFile"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const generate_1 = __importDefault(require("../../utils/generate"));
const reward_model_1 = require("../reward/reward.model");
const mongoose_1 = __importDefault(require("mongoose"));
const twilio_1 = require("../../middleware/twilio");
const rule_model_1 = require("../Setting/rule/rule.model");
const notification_interface_1 = require("../notification/notification.interface");
const userToken_1 = require("../../utils/userToken");
const socketHelper_1 = require("../../helpers/socketHelper");
// ✅ Step 1: OTP পাঠাও
const sendRegistrationOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.UserModel.findOne({ phoneNumber });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    yield (0, twilio_1.sendOTP)(phoneNumber);
    return { message: "OTP sent to " + phoneNumber };
});
// ✅ Step 2: OTP verify + User create
// const createUser = async (payload: any) => {
//     const { referralCode, phoneNumber, otp } = payload;
//     // OTP verify করো
//     try {
//         await verifyOTPCode(phoneNumber, otp);
//     } catch (err) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
//     }
//     const existingUser = await UserModel.findOne({ phoneNumber });
//     if (existingUser) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
//     }
//     // Check inviter
//     let inviterUser = null;
//     if (referralCode) {
//         inviterUser = await UserModel.findOne({ referralCode });
//         if (!inviterUser) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Invalid referral code");
//         }
//     }
//     // Create user
//     const user = await UserModel.create({
//         ...payload,
//         referralCode: generateNumber(8),
//         invitedBy: inviterUser ? inviterUser._id : null,
//         isPhoneVerified: true,
//         status: IStatus.ACTIVE,
//     });
//     // Invite reward logic
//     if (inviterUser) {
//         const updatedInviter = await UserModel.findByIdAndUpdate(
//             inviterUser._id,
//             { $inc: { successfulInvites: 1 } },
//             { new: true }
//         );
//         if (
//             updatedInviter &&
//             typeof updatedInviter.successfulInvites === "number" &&
//             updatedInviter.successfulInvites % 3 === 0
//         ) {
//             await Reward.create({
//                 userId: updatedInviter._id,
//                 type: "INVITE",
//                 title: "Invite Reward - 20 AED",
//                 discountAmount: 20,
//                 expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//                 isUsed: false,
//                 source: "SYSTEM",
//                 createdAt: new Date(),
//             });
//         }
//     }
//     return user;
// };
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { referralCode, phoneNumber, otp } = payload, rest = __rest(payload, ["referralCode", "phoneNumber", "otp"]);
        /* ================= OTP VERIFY ================= */
        // await verifyOTPService(
        //     phoneNumber,
        //     otp,
        // );
        /* ================= IF USER EXISTS → LOGIN ================= */
        const existingUser = yield user_model_1.UserModel.findOne({ phoneNumber });
        if (existingUser) {
            yield session.abortTransaction();
            session.endSession();
            const token = yield (0, userToken_1.CreateUserToken)(existingUser);
            return {
                isNewUser: false,
                userId: existingUser._id,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
        }
        /* ================= CHECK INVITER ================= */
        let inviterUser = null;
        if (referralCode) {
            inviterUser = yield user_model_1.UserModel.findOne({ referralCode });
            if (!inviterUser) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid referral code");
            }
        }
        /* ================= CREATE USER ================= */
        const user = yield user_model_1.UserModel.create([
            Object.assign(Object.assign({}, rest), { phoneNumber, referralCode: (0, generate_1.default)(8), invitedBy: inviterUser ? inviterUser._id : null, isPhoneVerified: true, status: user_interface_1.IStatus.ACTIVE }),
        ], { session });
        /* ================= INVITE REWARD ================= */
        if (inviterUser) {
            const updatedInviter = yield user_model_1.UserModel.findByIdAndUpdate(inviterUser._id, { $inc: { successfulInvites: 1 } }, { new: true, session });
            if (updatedInviter && typeof updatedInviter.successfulInvites === "number" && updatedInviter.successfulInvites % 3 === 0) {
                yield reward_model_1.Reward.create([
                    {
                        userId: updatedInviter._id,
                        type: "INVITE",
                        title: "Invite Reward - 20 AED",
                        discountAmount: 20,
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        isUsed: false,
                        source: "SYSTEM",
                        status: user_interface_1.IStatus.PENDING,
                        createdAt: new Date(),
                    },
                ], { session });
                // realtime notification
                socketHelper_1.socketHelper.emit("notification", {
                    receiver: updatedInviter._id,
                    title: "Invite Reward - 20 AED",
                    message: "You received a 20 AED reward for inviting 3 users",
                    type: "INVITE_REWARD",
                });
                yield (0, socketHelper_1.saveNotification)({
                    receiverId: updatedInviter._id,
                    title: "Invite Reward - 20 AED",
                    body: "You received a 20 AED reward for inviting 3 users",
                    notificationEvent: notification_interface_1.INOTIFICATION_EVENT.INVITE,
                    notificationType: notification_interface_1.INOTIFICATION_TYPE.NOTIFICATION,
                    referenceId: updatedInviter._id,
                    referenceType: notification_interface_1.IREFERENCE_TYPE.USER,
                    read: false,
                });
            }
            // if (inviterUser.fcmToken) {
            //     await firebaseNotificationBuilder({
            //         user: inviterUser,
            //         title: "Enjoy a 20 AED reward ",
            //         body: "You can enjoy a 20 AED reward for inviting a new user",
            //         notificationEvent: INOTIFICATION_EVENT.INVITE,
            //         notificationType: INOTIFICATION_TYPE.NOTIFICATION,
            //         referenceId: inviterUser._id,
            //         referenceType: "User"
            //     })
            // }
        }
        yield session.commitTransaction();
        session.endSession();
        /* ================= GENERATE TOKENS ================= */
        const token = yield (0, userToken_1.CreateUserToken)(user[0]);
        return {
            isNewUser: true,
            user: "Bhai",
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createUser = createUser;
const getAllUser = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_interface_1.USER_ROLE.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not authorized");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.UserModel.find().lean(), query);
    const result = yield queryBuilder
        .search(["name", "email"])
        .filter()
        .limit()
        .dateRange()
        .sort()
        .fields()
        .paginate();
    const [meta, data] = yield Promise.all([result.getMeta(), result.build()]);
    if (!data || data.length === 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No user found");
    }
    return { meta, data };
});
const updateUser = (payload, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById({ _id: owner.userId });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    if (payload.image && result.image) {
        (0, unLinkFile_1.default)(result.image);
    }
    return yield user_model_1.UserModel.findOneAndUpdate({ _id: owner.userId }, payload, { new: true });
});
const userDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById({ _id: userId }).select("-password ");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    const totalVisit = yield reward_model_1.ViewReward.aggregate([
        {
            $match: {
                userId: result._id,
                status: user_interface_1.IStatus.APPROVED
            }
        },
        {
            $group: {
                _id: null,
                totalVisit: { $sum: '$viewCount' },
                lastVisit: { $max: "$lastVisitAt" }
            }
        }
    ]);
    const totalVisitValue = totalVisit.length > 0 ? totalVisit[0].totalVisit : 0;
    const lastVisit = totalVisit.length > 0 ? totalVisit[0].lastVisit : 0;
    const availableReward = yield reward_model_1.Reward.find({ userId: result._id, status: user_interface_1.IStatus.PENDING });
    const tire = yield rule_model_1.Rule.findOne({ ruleType: 'rewardRule' });
    return Object.assign(Object.assign({}, result.toObject()), { TotalVisit: totalVisitValue, LastVisit: lastVisit, availableReward });
});
const deleteUser = (owner, userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (owner.role === user_interface_1.USER_ROLE.USER) {
        if (!password) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required to delete your account");
        }
        const user = yield user_model_1.UserModel.findById(owner.id).select("password");
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new AppError_1.default(http_status_codes_1.default.EXPECTATION_FAILED, "Incorrect password");
        }
        return yield userDeleteFunc(owner.id, user_interface_1.IStatus.DELETED);
    }
    if (owner.role === user_interface_1.USER_ROLE.SUPER_ADMIN && userId) {
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (user.role === user_interface_1.USER_ROLE.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Admin cannot delete another admin");
        }
        return yield userDeleteFunc(userId, user_interface_1.IStatus.SUSPENDED);
    }
    throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
});
const userDeleteFunc = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = { status };
    if (status === user_interface_1.IStatus.DELETED) {
        Object.assign(updateData, { name: "", email: "", password: "", image: "" });
    }
    const result = yield user_model_1.UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return result;
});
const getUserCoins = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(userId).select("coins");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return result;
});
exports.userService = {
    sendRegistrationOTP, // ✅ নতুন
    createUser: // ✅ নতুন
    exports.createUser,
    getAllUser,
    updateUser,
    userDetails,
    deleteUser,
    getUserCoins,
};
