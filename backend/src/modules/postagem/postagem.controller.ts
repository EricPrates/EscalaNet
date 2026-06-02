// src/modules/postagem/postagem.controller.ts
import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IPostagemService } from "./postagem.interfaces";
import { 
    SchemaCriarPostagem, 
    SchemaAtualizarPostagem, 
    SchemaBuscarPorIdPostagem,
    SchemaFiltrosPostagem,
    QueryIncludesPostagem 
} from "./postagem.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerPostagemController(service: IPostagemService) {
    return {
        // Listagem administrativa (com filtros, status, etc)
        async listarPostagens(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosPostagem.parse(req.query);
            const { includes } = QueryIncludesPostagem.parse(req.query);
            const relations = transformarIncludesEmRelations(includes);
            
            const { data, meta } = await service.listar(pagina, limite, filtros, relations);
            return res.status(200).json(montarRespostaPaginada('Postagens listadas com sucesso', data, meta));
        },

        // Listagem pública (apenas publicadas)
        async listarPublicadas(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listarPublicados(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Postagens publicadas listadas com sucesso', data, meta));
        },

        async obterPostagem(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdPostagem.parse(req.params);
            const { includes } = QueryIncludesPostagem.parse(req.query);
            const relations = transformarIncludesEmRelations(includes);
            
            const postagem = await service.obterPorId(id, relations);
            return res.status(200).json(montarRespostaSucesso('Postagem obtida com sucesso', postagem));
        },

        async criarPostagem(req: Request, res: Response) {
            const data = SchemaCriarPostagem.parse(req.body);
            const postagem = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Postagem criada com sucesso', postagem));
        },

        async atualizarPostagem(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdPostagem.parse(req.params);
            const data = SchemaAtualizarPostagem.parse(req.body);
            const postagem = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Postagem atualizada com sucesso', postagem));
        },

        async deletarPostagem(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdPostagem.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Postagem deletada com sucesso'));
        }
    };
}