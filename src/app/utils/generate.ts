import { IUser } from "../modules/user/user.interface";
import { createHash, randomBytes } from "crypto";


const generateNumber = (length: number = 6): number => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default generateNumber;




export const generateHashCode = (user: IUser): string => {
    const { email, role, _id } = user;

    const raw = [
        role,
        email,
        _id.toString(),
        Date.now().toString(),
        process.hrtime.bigint(),
        randomBytes(64).toString("hex")].join("|");

    const token = createHash("sha256")
        .update(raw)
        .digest("hex");

    return token;
};