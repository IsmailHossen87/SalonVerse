import { Schema, model } from 'mongoose';
import { IRule, RuleType } from './rule.interface';



const ruleSchema = new Schema<IRule>(
     {
          platformName: { type: String, trim: true, },
          supportEmail: { type: String, trim: true, },
          passwordLength: { type: Number, min: 4, },
          ruleType: { type: String, enum: Object.values(RuleType), required: true },

          everyVisitCoins: { type: Number, },
          timeZoneStart: { type: Date },
          timeZoneEnd: { type: Date },
          timeZoneGetCoin: { type: Number, },
          totalVist: { type: Number, },
          totalVisitGetCoin: { type: Number, },
          inviteEarCoin: { type: Number, },


          tireName: { type: String, trim: true, },
          tireLevel: { type: Number, },
          tireCoins: { type: Number, },
     },
     {
          timestamps: true,
     }
);

export const Rule = model<IRule>('Rule', ruleSchema);
