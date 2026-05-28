import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { IChamadaRepository } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO } from "./chamada.schemas";

export function fazerChamadaRepo(dataSource: DataSource): IChamadaRepository {
    const repo = dataSource.getRepository(Chamada);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>, select?: FindOptionsSelect<Chamada>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                relations,
                select,
                where,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Chamada>, select?: FindOptionsSelect<Chamada>) {
            return await repo.findOne({ where: { id }, relations, select }) || null;
        },

        async obterPorData(data: FindOptionsWhere<Chamada>) {
            return await repo.findOne({ where: data }) || null;
        },

        async criar(data: CriarChamadaDTO) {
            const chamada = repo.create(data);
            return repo.save(chamada);
        },

        async atualizar(id: number, data: Partial<CriarChamadaDTO>) {
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
