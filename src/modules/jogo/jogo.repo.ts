import { DataSource } from "typeorm";
import { Jogo } from "./Jogo.model";
import { CriarJogoDTO } from "./jogo.schemas";
import { IJogoRepository } from "./jogo.interfaces";

export function fazerJogoRepo(dataSource: DataSource): IJogoRepository {
    const repo = dataSource.getRepository(Jogo);

    const selectBase = {
        id: true, nome: true, data: true, golsTimeA: true, golsTimeB: true,
        timeA: { id: true, nome: true }, timeB: { id: true, nome: true },
        arbitro: { id: true, nome: true }, categoria: { id: true, nome: true },
    };

    return {
        async listar(pagina = 1, limite = 10) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                skip, take: limite, order: { data: 'DESC' },
                relations: ['timeA', 'timeB', 'arbitro', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorNucleo(pagina = 1, limite = 10, nucleoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: [{ timeA: { id: nucleoId } }, { timeB: { id: nucleoId } }],
                skip, take: limite, order: { data: 'DESC' },
                relations: ['timeA', 'timeB', 'arbitro', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorCategoria(pagina = 1, limite = 10, categoriaId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { categoria: { id: categoriaId } },
                skip, take: limite, order: { data: 'DESC' },
                relations: ['timeA', 'timeB', 'arbitro', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['timeA', 'timeB', 'arbitro', 'categoria'],
                select: selectBase,
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
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
