import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
    body: z.object({
        email: z.string(),
        otp: z.number(),
        hash: z.string()
    }),
});


export const authValidation = {
    createVerifyEmailZodSchema,
};