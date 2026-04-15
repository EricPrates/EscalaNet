import { NextFunction, Request, Response } from "express";
import { verificarToken } from "../utils/verificarToken";
import { authStorage } from "../utils/authStorage";
import { AuthContext } from "../utils/util.types";
import { AppError } from "../utils/AppError";



export async function middlewareTokenContexto(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    let decoded: AuthContext | null = null;
    if (!authHeader) {
        throw new AppError(401);
    }
    const partAuthHeader = authHeader.split(' ');

    if (partAuthHeader[0] !== 'Bearer' || partAuthHeader.length !== 2 || !partAuthHeader[1]) {
        throw new AppError(401);
    }


    const token = partAuthHeader[1];
    decoded = verificarToken(token);
    if (!decoded) {
        throw new AppError(401);
    }
    return authStorage.run(decoded as AuthContext, () => next());

};