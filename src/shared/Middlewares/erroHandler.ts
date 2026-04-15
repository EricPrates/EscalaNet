import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";
import { montarRespostaErro } from "../utils/construtorResposta";
import { HTTP_STATUS_ERRORS } from '../utils/util.types';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof AppError) {
        console.error(`AppError: ${err.statusCode} - ${err.message}`);
        if (HTTP_STATUS_ERRORS[err.statusCode]) {
            return res.status(err.statusCode).json(montarRespostaErro(err.statusCode, err.message ? err.message : HTTP_STATUS_ERRORS[err.statusCode], err.detalhes));
        }
    
    }
    console.error(`Erro não tratado: ${err.message}`);
    return res.status(500).json(montarRespostaErro(500, 'Erro interno do servidor', err.message));
}

