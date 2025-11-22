import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './user';

declare global {
    namespace Express {
        interface Request {
            user?: IUser | JwtPayload;
        }
    }
}
