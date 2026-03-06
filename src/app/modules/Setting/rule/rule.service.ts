import { StatusCodes } from 'http-status-codes';
import { EPermissionType, IRule, RuleType } from './rule.interface';
import { Rule, Tire } from './rule.model';
import AppError from '../../../errorHalper.ts/AppError';
import { UserModel } from '../../user/user.model';
import { USER_ROLE } from '../../user/user.interface';

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

const tireRule = async (payload: any, userId: string) => {
     console.log(payload, userId);
     const user = await UserModel.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, "User not found",)
     }
     if (user.role !== USER_ROLE.SUPER_ADMIN) {
          throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized to create tire",)
     }
     const checkTire = await Tire.findOne({ tireName: payload.tireName });
     if (checkTire) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Tire already exists",)
     }
     const createTire = await Tire.create({ userId, ...payload });
     return createTire;
}

const getTire = async () => {
     const result = await Tire.find();
     if (result.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, "Tire not found",)
     }
     return result;
}
export const RuleService = {
     globalRule,
     smartRule,
     rewardRule,
     getRule,
     tireRule,
     getTire
}
