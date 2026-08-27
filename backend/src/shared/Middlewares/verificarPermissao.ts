import { Request, NextFunction, Response } from 'express';
import { authStorage } from '../utils/authStorage';
import { AppError } from '../utils/AppError';
import { SchemaId } from '../utils/util.types';

export const verificarPermissao = (...permissoesNecessarias: string[]) => {

    return (_req: Request, _res: Response, next: NextFunction) => {
       const usuario = authStorage.getStore();
        
        if (!usuario?.id) {
            console.log("entrei no error")
            console.log(usuario)
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
export const verificarPermissaoProfessorNucleo = (req: Request, _res: Response, next: NextFunction) => {
    const usuario = authStorage.getStore();
    if (!usuario) {
        throw new AppError(401);
    }
    if(usuario.permissao === 'professor' && usuario.nucleoVinculadoId == SchemaId.parse(req.params.id)) {
        return next();
    }
    if(usuario.permissao === 'admin') {
        return next();
    }
    throw new AppError(403);
}