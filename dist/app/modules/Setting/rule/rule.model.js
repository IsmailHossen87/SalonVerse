"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tire = exports.Rule = void 0;
const mongoose_1 = require("mongoose");
const rule_interface_1 = require("./rule.interface");
const ruleSchema = new mongoose_1.Schema({
    platformName: { type: String, trim: true, },
    supportEmail: { type: String, trim: true, },
    passwordLength: { type: Number, min: 4, },
    ruleType: { type: String, enum: Object.values(rule_interface_1.RuleType), required: true },
    everyVisitCoins: { type: Number, },
    timeZoneStart: { type: Number },
    timeZoneEnd: { type: Number },
    timeZoneGetCoin: { type: Number, },
    totalVist: { type: Number, },
    totalVisitGetCoin: { type: Number, },
    inviteEarCoin: { type: Number, },
}, {
    timestamps: true,
});
exports.Rule = (0, mongoose_1.model)('Rule', ruleSchema);
const tireSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    tireName: { type: String, trim: true },
    tireCoins: { type: Number, },
}, {
    timestamps: true,
});
exports.Tire = (0, mongoose_1.model)('Tire', tireSchema);
