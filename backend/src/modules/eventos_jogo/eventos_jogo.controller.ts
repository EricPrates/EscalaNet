import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IEventoJogoService } from "./eventos_jogo.interfaces";
import { QueryIncludesEventosJogo, SchemaBaseEventoJogo, SchemaFiltroEventoJogo } from "./eventos_jogo.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";
import { SchemaBuscarPorIdCategoria } from '../categoria/categoria.schemas';


export function fazerEventoJogoController(service: IEventoJogoService) {
    return {
        async listar(req: Request, res: Response) {
            const where = SchemaFiltroEventoJogo.parse(req.query);
            const { includes } = QueryIncludesEventosJogo.parse(req.query);
            const queryIncludes = transformarIncludesEmRelations(includes);
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite, where, queryIncludes);
            return res.status(200).json(montarRespostaPaginada('Eventos listados com sucesso', data, meta));
        },


        async obterEventoPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesEventosJogo.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            const evento = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Evento obtido com sucesso', evento));
        },

        async criarEvento(req: Request, res: Response) {
            const data = SchemaBaseEventoJogo.parse(req.body);
            const evento = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Evento registrado com sucesso', evento));
        },

        async atualizarEvento(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            const data = SchemaBaseEventoJogo.partial().parse(req.body);
            const evento = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Evento atualizado com sucesso', evento));
        },

        async deletarEvento(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };
}
