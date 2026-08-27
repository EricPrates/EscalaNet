import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaBaseNucleo, SchemaAtualizarNucleo, SchemaFiltrosNucleo, SchemaIdNucleo } from "./nucleo.schemas";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { INucleoService } from "./nucleo.interfaces";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";



export function fazerNucleoController(service: INucleoService) {
    return {
        async listarNucleos(req: Request, res: Response) {
            const {limite, pagina} = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosNucleo.parse(req.query);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Núcleos listados com sucesso', data, meta));
        },
     
        async obterNucleoPorId(req: Request, res: Response) {
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const  id  = SchemaIdNucleo.parse(req.params);
            const nucleo = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Núcleo obtido com sucesso', nucleo));
        },

        async criarNucleo(req: Request, res: Response) {
            const data = SchemaBaseNucleo.parse(req.body);
            const nucleo = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Núcleo criado com sucesso', nucleo));
        },

        async atualizarNucleo(req: Request, res: Response) {
            const  id  = SchemaIdNucleo.parse(req.params);
            const data = SchemaAtualizarNucleo.parse(req.body);
            const nucleo = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Núcleo atualizado com sucesso', nucleo));
        },

        async deletarNucleo(req: Request, res: Response) {
            const  id  = SchemaIdNucleo.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Núcleo deletado com sucesso'));
        },

        async obterDashboardNucleo(req: Request, res: Response) {
            const  id  = SchemaIdNucleo.parse(req.params);
            const dashboard = await service.obterDashboard(id);
            return res.status(200).json(montarRespostaSucesso('Dashboard do núcleo obtido com sucesso', dashboard));
        },
    };
}
