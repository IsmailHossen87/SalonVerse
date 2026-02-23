import axios from "axios";
import httpStatus from "http-status-codes";
import AppError from "../../errorHalper.ts/AppError";


export const verifyRecaptcha = async (token: string) => {
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
            params: {
                secret: process.env.RECAPTCHA_SECRET,
                response: token,
            },
        }
    );

    if (!response.data.success) {
        throw new AppError(httpStatus.BAD_REQUEST, "reCAPTCHA failed");
    }
};
