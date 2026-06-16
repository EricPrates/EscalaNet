import { DataSource, FindOptionsWhere } from "typeorm";
import { Treino } from "./Treino.model";
import { CriarTreinoDTO } from "./treino.schemas";
import { ITreinoRepository } from "./treino.interfaces";

export function fazerTreinoRepo(dataSource: DataSource): ITreinoRepository {
    const repo = dataSource.getRepository(Treino);

    return {
    
        async listar(pagina: number, limite: number, where: FindOptionsWhere<Treino>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                select: { id: true, data: true, nucleo: { id: true, nome: true } },
            }) || null;
        },

        async criar(data: CriarTreinoDTO) {
            const treino = repo.create(data);
            return repo.save(treino);
        },

        async atualizar(id: number, data: Partial<CriarTreinoDTO>) {
            const treino = await repo.findOne({ where: { id } });
            if (!treino) return null;
            repo.merge(treino, data as any);
            await repo.save(treino);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
