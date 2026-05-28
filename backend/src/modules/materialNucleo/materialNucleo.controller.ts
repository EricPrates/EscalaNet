import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IMaterialNucleoService } from "./materialNucleo.interfaces";
import { QueryIncludesMaterial, SchemaAtualizarMaterial, SchemaBuscarPorIdMaterial, SchemaFiltrosMaterial, SchemaBaseMaterial } from "./materialNucleo.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerMaterialNucleoController(service: IMaterialNucleoService) {
    return {
        async listarMateriais(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosMaterial.parse(req.query);
            const { includes } = QueryIncludesMaterial.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Materiais listados com sucesso', data, meta));
        },

        async obterMaterialPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesMaterial.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdMaterial.parse(req.params);
            const material = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Material obtido com sucesso', material));
        },

        async criarMaterial(req: Request, res: Response) {
            const data = SchemaBaseMaterial.parse(req.body);
            const material = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Material criado com sucesso', material));
        },

        async atualizarMaterial(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdMaterial.parse(req.params);
            const data = SchemaAtualizarMaterial.parse(req.body);
            const material = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Material atualizado com sucesso', material));
        },

        async deletarMaterial(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdMaterial.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };
}