import { DataSource } from "typeorm";
import { EventosJogo } from "./EventosJogo.model";
import { CriarEventoJogoDTO } from "./eventos_jogo.schemas";
import { IEventoJogoRepository } from "./eventos_jogo.interfaces";

export function fazerEventoJogoRepo(dataSource: DataSource): IEventoJogoRepository {
    const repo = dataSource.getRepository(EventosJogo);

    const selectBase = {
        id: true, tipo: true, descricao: true, minuto: true,
        jogo: { id: true, nome: true, data: true },
        usuario: { id: true, nome: true },
        nucleo: { id: true, nome: true },
        alunoEnvolvido: { id: true, nome: true },
    };

    return {
        async listar(pagina = 1, limite = 10) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                skip, take: limite, order: { minuto: 'ASC' },
                relations: ['jogo', 'usuario', 'nucleo', 'alunoEnvolvido'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorJogo(pagina = 1, limite = 10, jogoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { jogo: { id: jogoId } },
                skip, take: limite, order: { minuto: 'ASC' },
                relations: ['jogo', 'usuario', 'nucleo', 'alunoEnvolvido'],
                select: selectBase,
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['jogo', 'usuario', 'nucleo', 'alunoEnvolvido'],
                select: selectBase,
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
