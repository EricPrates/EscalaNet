import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { IClassificacaoRepository } from "./classificacao.interfaces";
import { Classificacao } from "./Classificacao.model";


export function fazerClassificacaoRepo(dataSource: DataSource): IClassificacaoRepository {
    const repo = dataSource.getRepository(Classificacao);
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Classificacao>, relations?: FindOptionsRelations<Classificacao>, select?: FindOptionsSelect<Classificacao>): Promise<{ data: Classificacao[]; total: number }> {
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
        async obterPorId(id: number, relations?: FindOptionsRelations<Classificacao>): Promise<Classificacao | null> {
            return await repo.findOne({ where: { id }, relations }) || null;
        },
        async obterPorFiltro(data: FindOptionsWhere<Classificacao>, relations?: FindOptionsRelations<Classificacao>): Promise<Classificacao | null> {
            return await repo.findOne({ where: data, relations }) || null;
        },
        async criar(data: Partial<Classificacao>): Promise<Classificacao> {
            const classificacao = repo.create(data);
            return repo.save(classificacao);
        },
        async atualizar(id: number, data: Partial<Classificacao>): Promise<Classificacao | null> {
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },
        async deletar(id: number): Promise<boolean> {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    }
}