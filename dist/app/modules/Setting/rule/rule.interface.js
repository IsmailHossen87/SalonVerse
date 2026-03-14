"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleType = exports.EPermissionType = void 0;
var EPermissionType;
(function (EPermissionType) {
    EPermissionType["IS_EMAIL_NOTIFICATIONS"] = "is-email-notifications";
    EPermissionType["IS_APP_NOTIFICATIONS"] = "is-app-notifications";
    EPermissionType["IS_AUTO_APPROVE_EVENTS"] = "is-auto-approve-events";
    EPermissionType["IS_VISIBILITY_PUBLIC"] = "is-visibility-public";
    EPermissionType["IS_EXPIRED_EVENTS_AUTO_LOCK"] = "is-expired-events-auto-lock";
})(EPermissionType || (exports.EPermissionType = EPermissionType = {}));
var RuleType;
(function (RuleType) {
    RuleType["SMART_RULE"] = "smartRule";
    RuleType["REWARD_RULE"] = "rewardRule";
    RuleType["GLOBAL_RULE"] = "globalRule";
    RuleType["PRIVACY"] = "privacy";
    RuleType["TERMS"] = "terms";
    RuleType["ABOUT"] = "about";
    RuleType["APP_EXPLAIN"] = "appExplain";
    RuleType["SUPPORT"] = "support";
    RuleType["SOCIAL_MEDIA"] = "socialMedia";
})(RuleType || (exports.RuleType = RuleType = {}));
