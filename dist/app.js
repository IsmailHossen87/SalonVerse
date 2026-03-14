"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandlare_1 = require("./app/middleware/globalErrorHandlare");
const notFound_1 = require("./app/middleware/notFound");
const router_1 = __importDefault(require("./app/Router/router"));
const webhookHandler_1 = __importDefault(require("./app/modules/stripe/webhookHandler"));
const user_model_1 = require("./app/modules/user/user.model");
const allCorn_1 = require("./app/modules/Setting/Corn/allCorn");
const app = (0, express_1.default)();
// ✅ STRIPE WEBHOOK MUST BE **BEFORE** express.json()
app.post('/api/v1/stripe/webhook', express_1.default.raw({ type: 'application/json' }), webhookHandler_1.default);
app.use((0, cors_1.default)({
    origin: [
        "http://10.10.7.37:3000",
        "http://10.10.7.37:3000",
        "http://localhost:3002",
        "https://ismail4000.binarybards.online",
        "https://zena-admin-dashboard.vercel.app",
        "https://zena-user-dashboard.vercel.app"
    ],
    credentials: true,
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1", router_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.use('/image', express_1.default.static('uploads/image'));
app.use('/media', express_1.default.static('uploads/media'));
app.use('/doc', express_1.default.static('uploads/doc'));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (userId) {
        const now = new Date();
        yield user_model_1.UserModel.findByIdAndUpdate(userId, {
            lastActiveAt: now,
        });
        const user = yield user_model_1.UserModel.findById(userId);
        if (user) {
            const fiveMinutes = 5 * 60 * 1000;
            const diff = now.getTime() - (((_b = user.lastActiveAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0);
            const inOnline = diff <= fiveMinutes;
            // If you want to store in DB (not necessary if dynamic calculation)
            // await UserModel.findByIdAndUpdate(userId, { inOnline });
            // Attach to req for frontend API responses
            req.userStatus = {
                inOnline,
                lastOnline: user.lastActiveAt,
            };
        }
    }
    next();
}));
app.set("trust proxy", 1);
app.get("/", (req, res) => {
    const date = new Date(Date.now());
    res.send(`
       <h1 style="text-align:center; color:#4CAF50; width: 70%; margin: auto; font-family:Verdana, sans-serif; font-size:3rem; text-transform:uppercase; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); margin-top: 20px;">
    Beep-boop! Server's awake and ready to serve!
</h1>
<p style="text-align:center; color:#FF5722; font-family:Verdana, sans-serif; font-size:1.25rem; font-weight:bold; margin-top: 10px;">
    ${date}
</p>
`);
});
(0, allCorn_1.startCheckSubscriptionCron)();
(0, allCorn_1.startRewardExpireCron)();
app.use(globalErrorHandlare_1.globalErrorHandlare);
app.use(notFound_1.notFound);
exports.default = app;
