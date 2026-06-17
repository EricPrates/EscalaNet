
import { AppError } from "../../shared/utils/AppError";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ICategoriaRepository, ICategoriaService } from "./categoria.interfaces";
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO, RespostaCategoriaDTO, SchemaBaseCategoria, SchemaCategoriasPaginadas } from "./categoria.schemas";
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';



export function fazerCategoriaService(categoriaRepo: ICategoriaRepository): ICategoriaService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Categoria>, relations?: FindOptionsRelations<Categoria>): Promise<{ data: RespostaCategoriaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await categoriaRepo.listar(pagina, limite, where, relations);
            return SchemaCategoriasPaginadas.parse({
                data: data || [],
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

            try {
                const categoria = await categoriaRepo.criar(data);
                return SchemaBaseCategoria.parse(categoria);
            } catch (err: any) {
                if (err.code === '23505') {
                    throw new AppError(409, 'Categoria já cadastrada');
                }
                throw err;
            }
        },

        async atualizar(id: number, data: Partial<CriarCategoriaDTO>): Promise<RespostaCategoriaDTO> {
            const categoriaExistente = await categoriaRepo.obterPorId(id);
            if (!categoriaExistente) throw new AppError(404, 'Categoria não encontrada');
            const categoria = await categoriaRepo.atualizar(id, data);
            return SchemaBaseCategoria.parse(categoria);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await categoriaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Categoria não encontrada');
            return deletado;
        },
    };
}
