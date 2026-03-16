import { Schema, model } from 'mongoose';
import { IRule, RuleType } from './rule.interface';



const ruleSchema = new Schema<IRule>(
     {
          platformName: { type: String, trim: true, },
          supportEmail: { type: String, trim: true, },
          passwordLength: { type: Number, min: 4, },
          ruleType: { type: String, enum: Object.values(RuleType), required: true },

          everyVisitCoins: { type: Number, },
          everyVisitIsActive: { type: Boolean, default: true },
          timeZoneStart: { type: Number },
          timeZoneEnd: { type: Number },
          timeZoneGetCoin: { type: Number, },
          timeZoneIsActive: { type: Boolean, default: true },
          totalVist: { type: Number, },
          totalVisitIsActive: { type: Boolean, default: true },
          totalVisitGetCoin: { type: Number, },
          inviteEarCoin: { type: Number, },
          inviteEarIsActive: { type: Boolean, default: true },
     },
     {
          timestamps: true,
     }
);

export const Rule = model<IRule>('Rule', ruleSchema);


const tireSchema = new Schema(
     {
          userId: { type: Schema.Types.ObjectId, ref: "User" },
          tireName: { type: String, trim: true },
          tireCoins: { type: Number },
          isActive: { type: Boolean, default: true },
     },
     {
          timestamps: true,
     }
);


export const Tire = model('Tire', tireSchema);


// Time & Day Reward Rule (from UI: Add New Time & Day Reward Rule modal)
const timeDayRuleSchema = new Schema(
     {
          ruleName: { type: String, required: true, trim: true },
          applicableDays: {
               type: [String],
               enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
               required: true
          },
          timeStart: { type: Number, default: 0 },   // hour in 24h (0-23)
          timeEnd: { type: Number, default: 23 },     // hour in 24h (0-23)
          pointsMultiplier: { type: Number, default: 2.0, min: 1 },
          description: { type: String, trim: true },
          isActive: { type: Boolean, default: true },
     },
     { timestamps: true }
);

export const TimeDayRule = model('TimeDayRule', timeDayRuleSchema);
