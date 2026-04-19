import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ICategoriaService } from "./categoria.interfaces";
import { CriarCategoriaDTO } from "./categoria.schemas";

export function fazerCategoriaController(service: ICategoriaService) {
    return {
        async listarCategorias(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Categorias listadas com sucesso', data, meta));
        },

        async obterCategoriaPorId(req: Request, res: Response) {
            const categoria = await service.obterPorId(Number(req.params.id));
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
