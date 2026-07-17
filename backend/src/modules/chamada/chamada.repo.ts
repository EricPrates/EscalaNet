import { DataSource, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IChamadaRepository } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO } from "./chamada.schemas";

export function fazerChamadaRepo(dataSource: DataSource): IChamadaRepository {
    const repo = dataSource.getRepository(Chamada);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },
    
        async obterPorId(id: number, relations?: FindOptionsRelations<Chamada>) {
            return await repo.findOne({ where: { id }, relations }) || null;
        },


        async criar(data: CriarChamadaDTO) {
            const chamada = repo.create(data);
            return repo.save(chamada);
        },

        async atualizar(id: number, data: Partial<CriarChamadaDTO>) {
            const chamada = await repo.findOne({ where: { id } });
            if (!chamada) return null;
            repo.merge(chamada, data);
            await repo.save(chamada);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
        async obterPorData(where: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada >): Promise<Chamada [] | null> {
            return await repo.find({ where, relations }) || null;  
         },

         async buscarConflitos(data: Date, timeId: number, relations?: FindOptionsRelations<Chamada>): Promise<Chamada [] | null> {
            return await repo.find({
                where: {
                    data,
                    time: { id: timeId }
                },
                relations
            }) || null;
         }
    };
}
