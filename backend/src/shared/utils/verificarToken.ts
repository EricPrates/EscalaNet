import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from './AppError';
import { AuthContext } from "./util.types";
import { z } from 'zod';

dotenv.config();

const SchemaAuthContext = z.object({
    id: z.number().int().positive(),
    nome: z.string().min(1),
    email: z.email(),
    permissao: z.enum(['coordenador', 'admin', 'professor', 'arbitro', 'auxiliar']),
    nucleoVinculadoId: z.number().int().positive().nullable().optional(),
});

export function verificarToken (token: string): AuthContext {
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'default_secret');
        return SchemaAuthContext.parse(decoded);
    } catch (error) {
        if (error instanceof jsonwebtoken.TokenExpiredError) {
            throw new AppError(401, 'Token expirado');
        }

        if (error instanceof jsonwebtoken.JsonWebTokenError) {
            throw new AppError(401, 'Token inválido');
        }

        if (error instanceof z.ZodError) {
            throw new AppError(401, 'Token com payload inválido');
        }

        throw new AppError(401, 'Falha ao validar token');
    }
};


