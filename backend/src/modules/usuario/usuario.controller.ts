import { IUsuarioService } from "./usuario.interfaces";
import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaBaseUsuario, SchemaBuscarPorIdUsuario, SchemaFiltrosUsuario, SchemaLoginUsuario, SchemaAtualizarUsuario } from "./usuario.schemas";
import gerarToken from "../../shared/utils/gerarToken";
import { SchemaPaginacaoQuery } from '../../shared/utils/listas.schema';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";




export function fazerUsuarioController(service: IUsuarioService) {
    return {
        async listarUsuarios(req: Request, res: Response) {
            console.log("Cheguei aqui ")
            const { limite, pagina } = SchemaPaginacaoQuery.parse(req.query);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const filtros = SchemaFiltrosUsuario.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Usuários listados com sucesso', data, meta));
        },
        async obterUsuarioPorId(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdUsuario.parse(req.params);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const usuario = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Usuário obtido com sucesso', usuario));
        },
    

        async criarUsuario(req: Request, res: Response) {
            const data = SchemaBaseUsuario.parse(req.body);
            const usuario = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Usuário criado com sucesso', usuario));
        },

        async login(req: Request, res: Response) {
            const { email, senha } = SchemaLoginUsuario.parse(req.body);

            const usuarioLogado = await service.obterUsuarioParaLogin(email, senha);
            const payload = { id: usuarioLogado.id, nome: usuarioLogado.nome, email: usuarioLogado.email, permissao: usuarioLogado.permissao, nucleoVinculadoId: usuarioLogado.nucleoVinculado?.id };
            const token = gerarToken(payload);
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).json(montarRespostaSucesso('Login realizado com sucesso', usuarioLogado, token));
        },
        async atualizarUsuario(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdUsuario.parse(req.params);
            const data = SchemaAtualizarUsuario.parse(req.body);
            const usuarioAtualizado = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Usuário atualizado com sucesso', usuarioAtualizado));
        },
        async deletarUsuario(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdUsuario.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Usuário deletado com sucesso'));
        },

    }
}