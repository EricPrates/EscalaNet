import { DataSource } from "typeorm";
import { Treino } from "./Treino.model";
import { CriarTreinoDTO } from "./treino.schemas";
import { ITreinoRepository } from "./treino.interfaces";

export function fazerTreinoRepo(dataSource: DataSource): ITreinoRepository {
    const repo = dataSource.getRepository(Treino);

    return {
        async listar(pagina = 1, limite = 10) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo'],
                select: { id: true, data: true, nucleo: { id: true, nome: true } },
            });
            return { data, total };
        },

        async listarPorNucleo(pagina = 1, limite = 10, nucleoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { nucleo: { id: nucleoId } },
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo'],
                select: { id: true, data: true, nucleo: { id: true, nome: true } },
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['nucleo'],
                select: { id: true, data: true, nucleo: { id: true, nome: true } },
            }) || null;
        },

        async criar(data: CriarTreinoDTO) {
            const treino = repo.create(data);
            return repo.save(treino);
        },

        async atualizar(id: number, data: Partial<CriarTreinoDTO>) {
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
