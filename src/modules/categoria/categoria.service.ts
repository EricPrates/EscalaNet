import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { ICategoriaRepository, ICategoriaService } from "./categoria.interfaces";
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO, FiltrosCategoriaDTO, RespostaCategoriaDTO, SchemaCategoriaResposta } from "./categoria.schemas";
import { FindOptionsWhere, ILike } from 'typeorm';

export function fazerCategoriaService(categoriaRepo: ICategoriaRepository): ICategoriaService {
    return {
        async listar(pagina: number, limite: number, filtros?: FiltrosCategoriaDTO) {
            const where: FindOptionsWhere<Categoria> = {};
            if (filtros?.nome) where.nome = ILike(`%${filtros.nome}%`);
            if (filtros?.ativa !== undefined) where.ativa = filtros.ativa;
            const { data, total } = await categoriaRepo.listar(pagina, limite, where);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaCategoriaResposta).parse({
                data: SchemaCategoriaResposta.array().parse(data),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.obterPorId(id);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaCategoriaResposta.parse(categoria);
        },

        async obterPorNome(nome: string): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.obterPorNome(nome);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaCategoriaResposta.parse(categoria);
        },

        async criar(data: CriarCategoriaDTO): Promise<RespostaCategoriaDTO> {
            const existente = await categoriaRepo.obterPorNome(data.nome);
            if (existente) throw new AppError(409, 'Categoria já cadastrada');
            const categoria = await categoriaRepo.criar(data);
            return SchemaCategoriaResposta.parse(categoria);
        },

        async atualizar(id: number, data: Partial<CriarCategoriaDTO>): Promise<RespostaCategoriaDTO> {
            const categoria = await categoriaRepo.atualizar(id, data);
            if (!categoria) throw new AppError(404, 'Categoria não encontrada');
            return SchemaCategoriaResposta.parse(categoria);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await categoriaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Categoria não encontrada');
            return deletado;
        },
    };
}
