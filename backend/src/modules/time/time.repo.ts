import { DataSource,  FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Time } from "./time.model";
import { CriarTimeDTO } from "./time.schemas";
import { ITimeRepository } from "./time.interfaces";

export function fazerTimeRepo(dataSource: DataSource): ITimeRepository {
    const repo = dataSource.getRepository(Time);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Time>, relations?: FindOptionsRelations<Time>, select?: FindOptionsSelect<Time>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                select,
                skip,
                take: limite,
                order: { nome: 'ASC' },
            });
            return { data, total };
        },
        async listarIdsPorNucleo(nucleoId: number): Promise<number[]> {
            const result = await repo.find({
                where: { nucleo: { id: nucleoId } },
                select: { id: true },
            });
            return result.map(time => time.id);
        },
        async obterPorId(id: number, relations?: FindOptionsRelations<Time>, select?: FindOptionsSelect<Time>) {
            return await repo.findOne({ where: { id }, relations, select }) || null;
        },

        async criar(data: CriarTimeDTO) {
            const time = repo.create(data);
            return repo.save(time);
        },

        async atualizar(id: number, data: Partial<CriarTimeDTO>) {
            const time = await repo.findOne({ where: { id } });
            if (!time) return null;
            repo.merge(time, data);
            await repo.save(time);
            return await this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
