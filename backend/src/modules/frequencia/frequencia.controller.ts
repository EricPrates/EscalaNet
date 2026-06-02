import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IFrequenciaService } from "./frequencia.interfaces";
import { QueryIncludesFrequencia, SchemaBaseFrequencia, SchemaFiltroFrequencia, SchemaFrequenciaId, SchemaFrequenciaResposta } from './frequencia.schemas';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";


export function fazerFrequenciaController(service: IFrequenciaService) {
    return {
        async listarFrequencias(req: Request, res: Response) {
            
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { includes } = QueryIncludesFrequencia.parse(req.query);
            const filtros = SchemaFiltroFrequencia.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },

        async obterFrequenciaPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesFrequencia.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaFrequenciaId.parse(req.params);
            const frequencia = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Frequência obtida com sucesso', frequencia));
        },

        async criarFrequencia(req: Request, res: Response) {
            const data = SchemaBaseFrequencia.parse(req.body);
            const frequencia = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Frequência registrada com sucesso', frequencia));
        },
        async listarFrequenciasPorJogador(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { id } = SchemaFrequenciaId.parse(req.params);
            const { data, meta } = await service.listarPorJogador(pagina, limite, id);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },
        async listarFrequenciaPorFiltro(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltroFrequencia.parse(req.query);
            const { includes } = QueryIncludesFrequencia.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.obterPorFiltros(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },
        async atualizarFrequencia(req: Request, res: Response) {
            const { id } = SchemaFrequenciaId.parse(req.params);
            const data = SchemaFrequenciaResposta.partial().parse(req.body);
            const frequencia = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Frequência atualizada com sucesso', frequencia));
        },

        async deletarFrequencia(req: Request, res: Response) {
            const { id } = SchemaFrequenciaId.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Frequência deletada com sucesso'));
        },
        async obterFrequenciaPrFiltro(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltroFrequencia.parse(req.query);
            const { includes } = QueryIncludesFrequencia.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const frequencia = await service.obterPorFiltros(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Frequência obtida com sucesso', frequencia));
        }
    };
}
