"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHashCode = void 0;
const crypto_1 = require("crypto");
const generateNumber = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.default = generateNumber;
const generateHashCode = (user) => {
    const { email, role, _id } = user;
    const raw = [
        role,
        email,
        _id.toString(),
        Date.now().toString(),
        process.hrtime.bigint(),
        (0, crypto_1.randomBytes)(64).toString("hex")
    ].join("|");
    const token = (0, crypto_1.createHash)("sha256")
        .update(raw)
        .digest("hex");
    return token;
};
exports.generateHashCode = generateHashCode;
