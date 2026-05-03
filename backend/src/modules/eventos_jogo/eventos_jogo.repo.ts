import { DataSource, FindOptionsRelations, FindOptionsSelect } from "typeorm";
import { EventosJogo } from "./EventosJogo.model";
import { CriarEventoJogoDTO } from "./eventos_jogo.schemas";
import { IEventoJogoRepository } from "./eventos_jogo.interfaces";

export function fazerEventoJogoRepo(dataSource: DataSource): IEventoJogoRepository {
    const repo = dataSource.getRepository(EventosJogo);


    return {
        async listar(pagina = 1, limite = 10, where?: any, relations?: FindOptionsRelations<EventosJogo>, select?: FindOptionsSelect<EventosJogo>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
               where,
                relations,
                select,
                skip,
                take: limite,
            });
            return { data, total };
        },


        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['jogo', 'usuario', 'nucleo', 'alunoEnvolvido'],
                select: { id: true, tipo: true, descricao: true, minuto: true },
            }) || null;
        },

        async criar(data: CriarEventoJogoDTO) {
            const evento = repo.create(data);
            return repo.save(evento);
        },

        async atualizar(id: number, data: Partial<CriarEventoJogoDTO>) {
            const evento = await repo.findOne({ where: { id } });
            if (!evento) return null;
            repo.merge(evento, data);
            await repo.save(evento);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
