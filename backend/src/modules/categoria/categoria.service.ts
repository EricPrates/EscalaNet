import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ICategoriaRepository, ICategoriaService } from "./categoria.interfaces";

import { CriarCategoriaDTO, FiltrosCategoriaDTO, RespostaCategoriaDTO, SchemaBaseCategoria } from "./categoria.schemas";

import { fazerCategoriaFiltrosERelacoes } from "./helpers/filtrosErelacoes";

export function fazerCategoriaService(categoriaRepo: ICategoriaRepository): ICategoriaService {
    return {
        async listar(pagina: number, limite: number, filtros?: FiltrosCategoriaDTO) {
            const { where, relations, select } = fazerCategoriaFiltrosERelacoes(filtros);
            const { data, total } = await categoriaRepo.listar(pagina, limite, where, relations, select);   
            return SchemaRespostaPaginada(SchemaBaseCategoria).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.obterPorId(id);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaBaseCategoria.parse(categoria);
        },

        async obterPorNome(nome: string): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.obterPorNome(nome);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaBaseCategoria.parse(categoria);
        },

        async criar(data: CriarCategoriaDTO): Promise<RespostaCategoriaDTO> {
            const existente = await categoriaRepo.obterPorNome(data.nome);
            if (existente) throw new AppError(409, 'Categoria já cadastrada');
            const categoria = await categoriaRepo.criar(data);
            return SchemaBaseCategoria.parse(categoria);
        },

        async atualizar(id: number, data: Partial<CriarCategoriaDTO>): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.atualizar(id, data);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaBaseCategoria.parse(categoria);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await categoriaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Categoria não encontrada');
            return deletado;
        },
    };
}
