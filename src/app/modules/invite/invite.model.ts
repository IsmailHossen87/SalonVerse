import { model, Schema, Types } from "mongoose";
import { IStatus } from "../user/user.interface";

// invite.model.ts
const inviteSchema = new Schema({
    inviter: { type: Types.ObjectId, ref: "User" },
    invitedUser: { type: Types.ObjectId, ref: "User" },
    status: { type: String, enum: Object.values(IStatus), default: IStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
});

export const Invite = model("Invite", inviteSchema);