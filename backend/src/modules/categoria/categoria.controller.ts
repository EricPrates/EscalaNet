import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ICategoriaService } from "./categoria.interfaces";
import { SchemaFiltrosCategoria, SchemaCriarCategoria, SchemaBuscarPorIdCategoria, SchemaAtualizarCategoria } from './categoria.schemas';
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerCategoriaController(service: ICategoriaService) {
    return {
        async listarCategorias(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosCategoria.parse(req.query);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Categorias listadas com sucesso', data, meta));
        },

        async obterCategoriaPorId(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const categoria = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Categoria obtida com sucesso', categoria));
        },

        async criarCategoria(req: Request, res: Response) {
            const data = SchemaCriarCategoria.parse(req.body)
            const categoria = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Categoria criada com sucesso', categoria));
        },
      
        async atualizarCategoria(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            const data = SchemaAtualizarCategoria.parse(req.body);
            const categoria = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Categoria atualizada com sucesso', categoria));
        },

        async deletarCategoria(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdCategoria.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Categoria deletada com sucesso'));
        },
        
       
    };
}
