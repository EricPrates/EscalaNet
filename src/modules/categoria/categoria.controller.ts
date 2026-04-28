import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ICategoriaService } from "./categoria.interfaces";
import { CriarCategoriaDTO, SchemaFiltrosCategoria } from "./categoria.schemas";

export function fazerCategoriaController(service: ICategoriaService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtro = SchemaFiltrosCategoria.parse(req.query);
            const includes = req.query.includes ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
            const { data, meta } = await service.listar(pagina, limite, filtro, includes);
            return res.status(200).json(montarRespostaPaginada('Categorias listadas com sucesso', data, meta));
        },

        async obterCategoriaPorId(req: Request, res: Response) {
            const includes = req.query.includes ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
            const categoria = await service.obterPorId(Number(req.params.id), includes);
            return res.status(200).json(montarRespostaSucesso('Categoria obtida com sucesso', categoria));
        },

        async criarCategoria(req: Request, res: Response) {
            const data = req.body as CriarCategoriaDTO;
            const categoria = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Categoria criada com sucesso', categoria));
        },

        async atualizarCategoria(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as Partial<CriarCategoriaDTO>;
            const categoria = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Categoria atualizada com sucesso', categoria));
        },

        async deletarCategoria(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Categoria deletada com sucesso'));
        },
    };
}
