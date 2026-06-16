import { DataSource,  FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Jogo } from "./Jogo.model";
import { CriarJogoDTO } from "./jogo.schemas";
import { IJogoRepository } from "./jogo.interfaces";

export function fazerJogoRepo(dataSource: DataSource): IJogoRepository {
    const repo = dataSource.getRepository(Jogo);

   

    return {
        async listar( pagina: number, limite: number, where?: FindOptionsWhere<Jogo>, relations?: FindOptionsRelations<Jogo>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { data: 'DESC' },
            });
            return { data, total };
        },
        async contar(where?: FindOptionsWhere<Jogo>): Promise<number> {
            return await repo.count({ where });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Jogo>, select?: FindOptionsSelect<Jogo>) {
            return await repo.findOne({
                where: { id },
                relations,
                select,
            }) || null;
        },

        async criar(data: CriarJogoDTO) {
            const jogo = repo.create(data);
            return repo.save(jogo);
        },

        async atualizar(id: number, data: Partial<CriarJogoDTO>) {
            const jogo = await repo.findOne({ where: { id } });
            if (!jogo) return null;
            repo.merge(jogo, data);
            await repo.save(jogo);
            return this.obterPorId(id, { timeA: true, timeB: true, competicao: true });
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
