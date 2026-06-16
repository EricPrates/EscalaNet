import { DataSource, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO } from "./categoria.schemas";
import { ICategoriaRepository } from "./categoria.interfaces";

export function fazerCategoriaRepo(dataSource: DataSource): ICategoriaRepository {
    const repo = dataSource.getRepository(Categoria);

    return {
        async listar(pagina = 1, limite = 10, where?: FindOptionsWhere<Categoria>, relations?: FindOptionsRelations<Categoria>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },
        async buscarPorIdadeMaxima(idadeMaxima: number, relations?: FindOptionsRelations<Categoria>) {
            return await repo.findOne({ where: { idadeMaxima }, relations }) || null;
        },
        async obterPorId(id: number, relations?: FindOptionsRelations<Categoria>) {
            return await repo.findOne({ where: { id }, relations }) || null;
        },

        async obterPorNome(nome: string, relations?: FindOptionsRelations<Categoria>) {
            return await repo.findOne({ where: { nome }, relations }) || null;
        },

        async criar(data: CriarCategoriaDTO) {
            const categoria = repo.create(data);
            return repo.save(categoria);
        },

        async atualizar(id: number, data: Partial<CriarCategoriaDTO>) {
            const categoria = await repo.findOne({ where: { id } });
            if (!categoria) return null;
            repo.merge(categoria, data as any);
            await repo.save(categoria);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
        
    }
};
