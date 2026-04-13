import { Request, Response, NextFunction } from 'express';
import { AppError } from "../Models/AppError";
import { contrutorDeResposta } from "../util/buildResponse";
import { HTTP_STATUS } from '../util/sendMessages';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof AppError) {

        if (HTTP_STATUS[err.statusCode]) {
            return res.status(err.statusCode).json(contrutorDeResposta(err.statusCode, err.message ? err.message : HTTP_STATUS[err.statusCode],  undefined, err.detalhes));
        }
          
    }
    return res.status(500).json(contrutorDeResposta(500, 'Erro interno do servidor', undefined, err.message));
}

