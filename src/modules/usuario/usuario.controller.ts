import { IUsuarioService } from "./usuario.interfaces";
import { Request, Response } from "express";
import { montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import {  CriarUsuarioDTO, LoginUsuarioDTO } from "./usuario.schemas";
import gerarToken from "../../shared/utils/gerarToken";


export function fazerUsuarioController(service: IUsuarioService) {
    return {
        async listarUsuarios(_req: Request, res: Response) {
            const usuarios = await service.listarUsuarios();
            return res.status(200).json(montarRespostaSucesso('Usuários listados com sucesso', usuarios));
        },

        async obterUsuarioPorId(req: Request, res: Response) {
            const usuario = await service.obterUsuarioPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Usuário obtido com sucesso', usuario));
        },
    

        async criarUsuario(req: Request, res: Response) {
            const { email, senha, permissao, nome } = req.body as CriarUsuarioDTO;
            const usuario = await service.criarUsuario({ email, senha, permissao, nome });
            return res.status(201).json(montarRespostaSucesso('Usuário criado com sucesso', usuario));
        },

        async criarUsuarioSemRetorno(req: Request, res: Response) {
            const { email, senha, permissao, nome } = req.body as CriarUsuarioDTO;

            await service.criarUsuarioSemRetorno({ email, senha, permissao, nome });
            return res.status(201).json(montarRespostaSucesso('Usuário criado com sucesso'));
        },

        async login (req: Request, res: Response) {
            const { email, senha } = req.body as LoginUsuarioDTO;

            const usuarioLogado = await service.obterUsuarioParaLogin(email, senha);
            const payload = { id: usuarioLogado.id, nome: usuarioLogado.nome, email: usuarioLogado.email, permissao: usuarioLogado.permissao };
            const token = gerarToken(payload);
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).json(montarRespostaSucesso('Login realizado com sucesso', usuarioLogado, token));
        }
    }
}