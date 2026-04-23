import { JwtPayload } from './auth.types';
import { Request } from "express";

export interface AuthRequest extends Request {
    user?: JwtPayload
}