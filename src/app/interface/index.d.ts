import { JwtPayload } from "jsonwebtoken";
// const token = req.headers.authorization;
// const verifyedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload

//   Upore 2 ta dile sort korar jonno
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload,
            userStatus?: {
                inOnline: boolean;
                lastOnline?: Date;
            };
        }
    }
}