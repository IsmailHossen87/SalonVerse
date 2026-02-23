// import twilio from "twilio";

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

// export const sendOTP = async (phoneNumber: string) => {
//     await client.verify.v2
//         .services(SERVICE_SID)
//         .verifications.create({ to: phoneNumber, channel: "sms" });
// };

// export const verifyOTPCode = async (phoneNumber: string, code: string) => {
//     const result = await client.verify.v2
//         .services(SERVICE_SID)
//         .verificationChecks.create({ to: phoneNumber, code });

//     if (result.status !== "approved") {
//         throw new Error("Invalid or expired OTP");
//     }
//     return true;
// };



