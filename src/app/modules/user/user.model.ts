import { model, Schema } from "mongoose";
import { USER_ROLE, IStatus, IUser, IAuthProvider } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
})

// user.model.ts
export const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER, },
    image: { type: String, },
    phoneNumber: { type: String, unique: true, required: true },
    personalInfo: {
        address: { type: String, },
        city: { type: String, },
        country: { type: String, },
        zipCode: { type: String, },
    },

    dateOfBirth: { type: Date, },
    secretRefreshToken: { type: [String], default: [] },
    auths: [authProviderSchema],
    verified: { type: Boolean, default: false, },
    status: { type: String, enum: Object.values(IStatus), default: IStatus.PENDING, },
    isVibrationNotificationEnabled: { type: Boolean, default: true, },
    isSoundNotificationEnabled: { type: Boolean, default: true, },
    fcmToken: { type: String, select: false },

    coins: { type: Number, default: 0 },
    spentCoins: { type: Number, default: 0 },

    referralCode: { type: String, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    successfulInvites: { type: Number, default: 0 },

    // Payment ----------💸💸💸
    stripeAccountInfo: {
        stripeAccountId: { type: String, },
    },
    stripeConnectedAccount: { type: String, },
    isCompleted: { type: Boolean, default: false, },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    isOnline: { type: Boolean, default: false, },
})


export const UserModel = model<IUser>('User', UserSchema);


