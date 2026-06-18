import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Treino } from "./Treino.model";
import { CriarTreinoDTO } from "./treino.schemas";
import { ITreinoRepository } from "./treino.interfaces";

export function fazerTreinoRepo(dataSource: DataSource): ITreinoRepository {
    const repo = dataSource.getRepository(Treino);

    return {

        async listar(pagina: number,
            limite: number,
            where?: FindOptionsWhere<Treino>,
            relations?: FindOptionsRelations<Treino>,
            select?: FindOptionsSelect<Treino>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                select,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Treino>) {
            return await repo.findOne({
                where: { id },
                relations,
            }) || null;
        },

        async criar(data: CriarTreinoDTO) {
            const treino = repo.create(data);
            return repo.save(treino);
        },

        async atualizar(id: number, data: Partial<CriarTreinoDTO>) {
            const treino = await repo.findOne({ where: { id } });
            if (!treino) return null;
            repo.merge(treino, data);
            await repo.save(treino);
            return await this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
