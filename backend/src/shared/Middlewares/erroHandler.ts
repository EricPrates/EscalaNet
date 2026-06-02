// shared/Middlewares/erroHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from "../utils/AppError";
import { montarRespostaErro } from "../utils/construtorResposta";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof ZodError) {
        const detalhes = err.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');
        
        console.error(`ZodError: ${detalhes}`);
        
        return res.status(400).json(
            montarRespostaErro(400, 'Dados de entrada inválidos', detalhes)
        );
    }
    
    if (err instanceof AppError) {
        console.error(`AppError [${err.statusCode}]: ${err.message}`);
        
        return res.status(err.statusCode).json(
            montarRespostaErro(err.statusCode, err.message, err.detalhes)
        );
    }
    
    // Erro desconhecido
    console.error(`Erro não tratado: ${err.message}`);
    console.error(err.stack);
    
    return res.status(500).json(
        montarRespostaErro(500, 'Erro interno do servidor', process.env.NODE_ENV === 'development' ? err.message : undefined)
    );
}