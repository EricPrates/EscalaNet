import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from '../Models/AppError';
import { AuthContext } from "../Interfaces/util.types";

dotenv.config();

export function verificarToken (token: string): AuthContext {
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded as AuthContext;
    } catch (error) {
        throw new AppError(401, 'Token inválido');
    }
};


