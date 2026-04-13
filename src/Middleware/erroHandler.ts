import { Request, Response, NextFunction } from 'express';
import { AppError } from "../Models/AppError";
import { Send } from "../util/sendHandler";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    
    if (err instanceof AppError) {
        switch (err.statusCode) {
            case 400:
                return Send.sendBadRequest(res, err.message);
            case 401:
                return Send.sendUnauthorized(res, err.message);
            case 403:
                return Send.sendForbidden(res, err.message);
            case 404:
                return Send.sendNotFound(res, err.message);
            case 409:
                return Send.sendConflict(res, err.message);
            case 422:
                return Send.sendUnprocessableEntity(res, err.message);
            case 503:
                return Send.sendServiceUnavailable(res, err.message);
            case 502:
                return Send.sendBadGateway(res, err.message);
            default:
                return Send.send(res, err.statusCode, err.message);
        }
    }
    return Send.sendInternalServerError(res, 'Erro interno do servidor');
}