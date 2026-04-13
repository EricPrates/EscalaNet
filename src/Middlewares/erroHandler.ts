import { Request, Response, NextFunction } from 'express';
import { AppError } from "../Models/AppError";
import { montarRespostaErro } from "../util/construtorResposta";
import { HTTP_STATUS_ERRORS } from '../Interfaces/util.types';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof AppError) {

        if (HTTP_STATUS_ERRORS[err.statusCode]) {
            return res.status(err.statusCode).json(montarRespostaErro(err.statusCode, err.message ? err.message : HTTP_STATUS_ERRORS[err.statusCode], err.detalhes));
        }
    
    }
    return res.status(500).json(montarRespostaErro(500, 'Erro interno do servidor', err.message));
}

