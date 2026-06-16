import { DataSource, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Frequencia } from "./frequencia.model";
import { CriarFrequenciaDTO } from "./frequencia.schemas";
import { IFrequenciaRepository } from "./frequencia.interfaces";

export function fazerFrequenciaRepo(dataSource: DataSource): IFrequenciaRepository {
    const repo = dataSource.getRepository(Frequencia);

    return {
        async listar(pagina = 1, limite = 10, where: FindOptionsWhere<Frequencia>, relations?: FindOptionsRelations<any>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },

        async listarPorJogador(pagina = 1, limite = 10, jogadorId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { jogador: { id: jogadorId } },
                skip, take: limite, order: { id: 'DESC' },
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
    
            }) || null;
        },

        async criar(data: CriarFrequenciaDTO) {
            const frequencia = repo.create(data);
            return repo.save(frequencia);
        },

        async atualizar(id: number, data: Partial<CriarFrequenciaDTO>) {
            const frequencia = await repo.findOne({ where: { id } });
            if (!frequencia) return null;
            repo.merge(frequencia, data);
            await repo.save(frequencia);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
