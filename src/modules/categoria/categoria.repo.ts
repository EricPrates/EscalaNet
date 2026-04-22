import { DataSource, FindOptionsWhere } from "typeorm";
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO } from "./categoria.schemas";
import { ICategoriaRepository } from "./categoria.interfaces";

export function fazerCategoriaRepo(dataSource: DataSource): ICategoriaRepository {
    const repo = dataSource.getRepository(Categoria);

    return {
        async listar(pagina = 1, limite = 10, where?: FindOptionsWhere<Categoria>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({ where: { id } }) || null;
        },

        async obterPorNome(nome: string) {
            return await repo.findOne({ where: { nome } }) || null;
        },

        async criar(data: CriarCategoriaDTO) {
            const categoria = repo.create(data);
            return repo.save(categoria);
        },

        async atualizar(id: number, data: Partial<CriarCategoriaDTO>) {
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
