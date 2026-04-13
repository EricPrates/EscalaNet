import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from '../Models/AppError';
import { AuthContext } from "../types/util.types";
import { authStorage } from "../util/authStorage";
dotenv.config();

export const verificarToken  = (token: string): AuthContext => {
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded as AuthContext;
    } catch (error) {
        throw new AppError(401, 'Token inválido');
    }
};

export async function processarTokenAdmin(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    const context = authStorage.getStore();
    if (!context || context.role !== 'admin') {
        throw new AppError(403, 'Acesso negado: privilégios de administrador necessários');
    }
    next();
}
export async function processarTokenCoordenador(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    const context = authStorage.getStore();
    if (!context || context.role !== 'coordenador') {
        throw new AppError(403,'Acesso negado: privilégios de coordenador necessários');
    }
    next();
}
