import { AppError } from "../Models/AppError";
import { getContext } from "../util/authStorage"
import { IUserService } from "../Interfaces/user.interfaces";
import { Request, Response } from "express";
import { montarRespostaSucesso } from "../util/construtorResposta";

export function makeUsuarioController(service : IUserService) {
    return{
        async listarUsuarios(req: Request, res: Response) {
           const usuarios = await service.listarUsuarios();
           return res.status(200).json(montarRespostaSucesso( 'Usuários listados com sucesso', usuarios));
        }
    }
}