import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ITimeService } from "./time.interfaces";
import { QueryIncludesTime, SchemaAtualizarTime,  SchemaBuscarPorIdTime, SchemaCriarTime, SchemaFiltrosTime } from './time.schemas';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerTimeController(service: ITimeService) {
    return {
        async listarTimes(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosTime.parse(req.query);
            const { includes } = QueryIncludesTime.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Times listados com sucesso', data, meta));
        },

        async obterTimePorId(req: Request, res: Response) {
            const { includes } = QueryIncludesTime.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdTime.parse(req.params);
            const time = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Time obtido com sucesso', time));
        },

        async criarTime(req: Request, res: Response) {
            const data = SchemaCriarTime.parse(req.body);
            const time = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Time criado com sucesso', time));
        },

        async atualizarTime(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTime.parse(req.params);
            const data = SchemaAtualizarTime.parse(req.body);
            const time = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Time atualizado com sucesso', time));
        },

        async deletarTime(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTime.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Time deletado com sucesso'));
        },
    };
}
