import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IChamadaService } from "./chamada.interfaces";
import { SchemaCriarChamada, SchemaFiltrosChamada, SchemaBuscarPorIdChamada, SchemaAtualizarChamada, QueryIncludesChamada } from './chamada.schemas';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerChamadaController(service: IChamadaService) {
    return {
        async listarChamadas(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtro = SchemaFiltrosChamada.parse(req.query);
            const { includes } = QueryIncludesChamada.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtro, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Chamadas listadas com sucesso', data, meta));
        },

        async obterChamadaPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesChamada.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdChamada.parse(req.params);
            const chamada = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Chamada obtida com sucesso', chamada));
        },
        async obterChamadaPorFiltro(req: Request, res: Response) {
            const filtro = SchemaFiltrosChamada.parse(req.query);
            const { includes } = QueryIncludesChamada.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const chamada = await service.obterPorFiltro(filtro, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Chamada obtida com sucesso', chamada));
        },
        async criarChamada(req: Request, res: Response) {
            const data = SchemaCriarChamada.parse(req.body)
            const chamada = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Chamada criada com sucesso', chamada));
        },

        async atualizarChamada(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdChamada.parse(req.params);
            const data = SchemaAtualizarChamada.parse(req.body);
            const chamada = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Chamada atualizada com sucesso', chamada));
        },
        async obterChamadaPorData(req: Request, res: Response) {
            const filtro = SchemaFiltrosChamada.parse(req.query);
            const chamada = await service.obterPorData( filtro );
            return res.status(200).json(montarRespostaSucesso('Chamada obtida com sucesso', chamada));
        },
        
        async deletarChamada(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdChamada.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };
}
