import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { IClassificacaoRepository } from "./classificacao.interfaces";
import { Classificacao } from "./Classificacao.model";
import { CriarClassificacaoDTO } from "./classificacao.schemas";


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

        async criar(data: CriarClassificacaoDTO): Promise<Classificacao> {
            const classificacao = repo.create(data);
            return repo.save(classificacao);
        },
        async buscarPorCompeticaoETime(competicaoId: number, timeId: number): Promise<Classificacao | null> {
            return await repo.findOne({
                where: {
                    competicao: { id: competicaoId },
                    time: { id: timeId }
                }
            }) || null;
        },
        async atualizar(id: number, data: Partial<Classificacao>): Promise<Classificacao | null> {
            const classificacao = await repo.findOne({ where: { id } });
            if (!classificacao) return null;
            repo.merge(classificacao, data as any);
            await repo.save(classificacao);
            return this.obterPorId(id);
        },
        async deletar(id: number): Promise<boolean> {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    }
}