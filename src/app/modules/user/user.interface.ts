// user.interface.ts
export enum USER_ROLE {
    OWNER = 'ADMIN',
    USER = 'USER',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum IStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    BLOCKED = 'BLOCKED',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
}

// authProviders
export interface IAuthProvider {
    provider: "google" | "credentials",
    providerId: string
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: USER_ROLE;
    image?: string;
    phoneNumber: string;
    status?: IStatus;
    verified?: boolean;
    auths: IAuthProvider[];
    personalInfo?: {
        address: string;
        city: string;
        country: string;
        zipCode?: string;
    };

    coins?: number;
    referralCode?: string;
    invitedBy?: string;
    successfulInvites?: number;

    secretRefreshToken?: [string]
    dateOfBirth?: Date;
    isVibrationNotificationEnabled?: boolean;
    isSoundNotificationEnabled?: boolean;
    fcmToken?: string; //for firebase cloud messaging

    // Payment ----------💸💸💸
    stripeAccountInfo?: {
        stripeAccountId: string;
    };
    stripeConnectedAccount?: string;
    isCompleted?: boolean;
    lastActiveAt?: Date;
    isOnline?: boolean;
}