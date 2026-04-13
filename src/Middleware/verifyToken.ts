import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
import { Send } from "../util/sendHandler";
import dotenv from 'dotenv';
import { AppError } from '../Models/AppError';
import { AuthContext } from "../types/util.types";
import { authStorage } from "../util/authStorage";
dotenv.config();

export const verifyToken  = (token: string): AuthContext => {
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded as AuthContext;
    } catch (error) {
        throw new AppError(401);
    }
};

export async function adminProcessToken(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const context = authStorage.getStore();
    if (!context || context.role !== 'admin') {
        return Send.sendForbidden(res,);
    }
    next();
}

