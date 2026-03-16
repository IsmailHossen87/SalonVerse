import { Model } from 'mongoose';

export enum EPermissionType {
     IS_EMAIL_NOTIFICATIONS = 'is-email-notifications',
     IS_APP_NOTIFICATIONS = 'is-app-notifications',
     IS_AUTO_APPROVE_EVENTS = 'is-auto-approve-events',
     IS_VISIBILITY_PUBLIC = 'is-visibility-public',
     IS_EXPIRED_EVENTS_AUTO_LOCK = 'is-expired-events-auto-lock',
}

export enum RuleType {
     SMART_RULE = 'smartRule',
     REWARD_RULE = 'rewardRule',
     GLOBAL_RULE = 'globalRule',
     PRIVACY = 'privacy',
     TERMS = 'terms',
     ABOUT = 'about',
     APP_EXPLAIN = 'appExplain',
     SUPPORT = 'support',
     SOCIAL_MEDIA = 'socialMedia',
}


export type IRule = {
     permission: boolean;
     // for my code
     platformName: string;
     supportEmail: string;
     passwordLength: number;
     ruleType: RuleType;
     everyVisitCoins: number;
     everyVisitIsActive: boolean;
     timeZoneStart: number;
     timeZoneEnd: number;
     timeZoneGetCoin: number;
     timeZoneIsActive: boolean;
     totalVist: number;
     totalVisitIsActive: boolean;
     totalVisitGetCoin: number;
     inviteEarCoin: number;
     inviteEarIsActive: boolean;
     tireName: string;
     tireCoins: number;
     isActive: boolean;
};

export type RuleModel = Model<IRule, Record<string, unknown>>;
