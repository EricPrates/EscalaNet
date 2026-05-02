import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";
import { montarRespostaErro } from "../utils/construtorResposta";
import { HTTP_STATUS_ERRORS } from '../utils/util.types';
import { converterZodError } from '../utils/tratarZodError';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    
    const erroFormatado = converterZodError(err);

    if (erroFormatado instanceof AppError) {
        console.error(`AppError: ${erroFormatado.statusCode} - ${erroFormatado.message}`);
        if (HTTP_STATUS_ERRORS[erroFormatado.statusCode]) {
            return res.status(erroFormatado.statusCode).json(montarRespostaErro(erroFormatado.statusCode, erroFormatado.message ? erroFormatado.message : HTTP_STATUS_ERRORS[erroFormatado.statusCode], erroFormatado.detalhes));
        }
    
    }
   
    console.error(`Erro não tratado: ${err.message}`);
    return res.status(500).json(montarRespostaErro(500, 'Erro interno do servidor', err.message));
}

