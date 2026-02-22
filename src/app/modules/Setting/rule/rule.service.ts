import { StatusCodes } from 'http-status-codes';
import { EPermissionType, IRule, RuleType } from './rule.interface';
import { Rule } from './rule.model';
import AppError from '../../../errorHalper.ts/AppError';

const globalRule = async (payload: any) => {
     const result = await Rule.findOneAndUpdate({ ruleType: RuleType.GLOBAL_RULE }, { ...payload, ruleType: RuleType.GLOBAL_RULE }, { upsert: true, new: true });
     return result;
}

const smartRule = async (payload: any) => {
     const result = await Rule.findOneAndUpdate({ ruleType: RuleType.SMART_RULE }, { ...payload, ruleType: RuleType.SMART_RULE }, { upsert: true, new: true });
     return result;
}

const rewardRule = async (payload: any) => {
     const result = await Rule.findOneAndUpdate({ ruleType: RuleType.REWARD_RULE }, { ...payload, ruleType: RuleType.REWARD_RULE }, { upsert: true, new: true });
     return result;
}

const getRule = async (ruleType: string) => {
     const result = await Rule.findOne({ ruleType });
     return result;
}

export const RuleService = {
     globalRule,
     smartRule,
     rewardRule,
     getRule
}
