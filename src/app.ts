import cors from 'cors';
import express from "express"
import { globalErrorHandlare } from "./app/middleware/globalErrorHandlare";
import { notFound } from "./app/middleware/notFound";
import router from "./app/Router/router";
import webhookHandler from './app/modules/stripe/webhookHandler';
import { UserModel } from './app/modules/user/user.model';
import { startCheckSubscriptionCron } from './app/modules/Setting/Corn/allCorn';


const app = express()
// ✅ STRIPE WEBHOOK MUST BE **BEFORE** express.json()
app.post(
    '/api/v1/stripe/webhook',
    express.raw({ type: 'application/json' }),
    webhookHandler
);



app.use(cors())
app.use(express.json())
app.use("/api/v1", router);
app.use('/uploads', express.static('uploads'));

app.use(async (req, res, next) => {
    const userId = req.user?.userId;

    if (userId) {
        const now = new Date();

        await UserModel.findByIdAndUpdate(userId, {
            lastActiveAt: now,
        });
        const user = await UserModel.findById(userId);
        if (user) {
            const fiveMinutes = 5 * 60 * 1000;
            const diff = now.getTime() - (user.lastActiveAt?.getTime() || 0);
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
});


app.set("trust proxy", 1);

app.get("/", (req, res) => {
    const date = new Date(Date.now());
    res.send(
        `
       <h1 style="text-align:center; color:#4CAF50; width: 70%; margin: auto; font-family:Verdana, sans-serif; font-size:3rem; text-transform:uppercase; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); margin-top: 20px;">
    Beep-boop! Server's awake and ready to serve!
</h1>
<p style="text-align:center; color:#FF5722; font-family:Verdana, sans-serif; font-size:1.25rem; font-weight:bold; margin-top: 10px;">
    ${date}
</p>
`
    );
})
startCheckSubscriptionCron()

app.use(globalErrorHandlare)
app.use(notFound)

export default app;