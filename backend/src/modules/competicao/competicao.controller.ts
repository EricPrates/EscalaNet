import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ICompeticaoService } from "./competicao.interfaces";
import { QueryIncludesCompeticao, SchemaAtualizarCompeticao, SchemaBuscarPorIdCompeticao, SchemaCriarCompeticao, SchemaFiltrosCompeticao } from './competicao.schemas';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerCompeticaoController(service: ICompeticaoService) {
    return {
        async listarCompeticoes(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosCompeticao.parse(req.query);
            const { includes } = QueryIncludesCompeticao.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Competições listadas com sucesso', data, meta));
        },

        async obterCompeticaoPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesCompeticao.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdCompeticao.parse(req.params);
            const competicao = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Competição obtida com sucesso', competicao));
        },

        async criarCompeticao(req: Request, res: Response) {
            const data = SchemaCriarCompeticao.parse(req.body);
            const competicao = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Competição criada com sucesso', competicao));
        },

        async atualizarCompeticao(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCompeticao.parse(req.params);
            const data = SchemaAtualizarCompeticao.parse(req.body);
            const competicao = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Competição atualizada com sucesso', competicao));
        },

        async deletarCompeticao(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCompeticao.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Competição deletada com sucesso'));
        },
    };
}