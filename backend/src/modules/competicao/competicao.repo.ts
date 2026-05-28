import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Competicao } from "./Competicao.model";
import { CriarCompeticaoDTO } from "./competicao.schemas";
import { ICompeticaoRepository } from "./competicao.interfaces";

export function fazerCompeticaoRepo(dataSource: DataSource): ICompeticaoRepository {
    const repo = dataSource.getRepository(Competicao);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Competicao>, relations?: FindOptionsRelations<Competicao>, select?: FindOptionsSelect<Competicao>) {
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

        async obterPorId(id: number, relations?: FindOptionsRelations<Competicao>, select?: FindOptionsSelect<Competicao>) {
            return await repo.findOne({
                where: { id },
                relations,
                select,
            }) || null;
        },

        async criar(data: CriarCompeticaoDTO) {
            const competicao = repo.create(data);
            return repo.save(competicao);
        },

        async atualizar(id: number, data: Partial<CriarCompeticaoDTO>) {
            const competicao = await repo.findOne({ where: { id } });
            if (!competicao) return null;
            repo.merge(competicao, data);
            await repo.save(competicao);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}