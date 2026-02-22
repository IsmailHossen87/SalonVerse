import { Types } from "mongoose";
import { IStatus } from "../user/user.interface";

// invite.interface.ts
export interface IInvite {
    inviter: Types.ObjectId,
    invitedUser: Types.ObjectId,
    status: IStatus,
    createdAt: Date
}