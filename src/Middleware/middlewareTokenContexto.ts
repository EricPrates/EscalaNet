import { NextFunction, Request, Response } from "express";
import { verificarToken } from "./verificarToken";
import { authStorage } from "../util/authStorage";
import { AuthContext } from "../types/util.types";
import { AppError } from "../Models/AppError";



export async function middlewareTokenContexto(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    let decoded: AuthContext | null = null;
   
        if (authHeader) {
            const partsAuthHeader = authHeader.split(' ');
            if (partsAuthHeader[0] === 'Bearer' && partsAuthHeader.length === 2 && partsAuthHeader[1]) {
                const token = partsAuthHeader[1];
                decoded = verificarToken(token);
                if (!decoded) {
                    throw new AppError(401);
                }
            }
        }
        authStorage.run(decoded as AuthContext, () => next());
};