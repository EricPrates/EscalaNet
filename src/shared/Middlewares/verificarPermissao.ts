import { Request, NextFunction, Response } from 'express';
import { authStorage } from '../utils/authStorage';
import { AppError } from '../utils/AppError';

export const verificarPermissao = (...permissoesNecessarias: string[]) => {

    return (_req: Request, _res: Response, next: NextFunction) => {
        const usuario = authStorage.getStore();
        if (!usuario) {
            throw new AppError(401);
        }
        if (!permissoesNecessarias || permissoesNecessarias.length === 0) {
            return next();
        }
        if(permissoesNecessarias.some(p => p === usuario.permissao)) {
            return next();
        }
       
        throw new AppError(403);
        

    }
}