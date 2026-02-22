import { NextFunction, Request, Response } from "express";



// Zod middleware 
export const validateRequest = (createUserZodSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.body = JSON.parse(req.body.data) || req.body  
        if (req.body.data) {
            // data: '{"name":"Ismail","email":"ismail@gmail.com","password":"123456"}'
            req.body = JSON.parse(req.body.data)
        }
        req.body = await createUserZodSchema.parseAsync(req.body)
        next()
    } catch (err) {
        next(err)
    }
}