import { DataSource } from "typeorm";
import { Frequencia } from "./frequencia.model";
import { CriarFrequenciaDTO } from "./frequencia.schemas";
import { IFrequenciaRepository } from "./frequencia.interfaces";

export function fazerFrequenciaRepo(dataSource: DataSource): IFrequenciaRepository {
    const repo = dataSource.getRepository(Frequencia);

    const selectBase = {
        id: true, data: true, presente: true,
        aluno: { id: true, nome: true },
        treino: { id: true, data: true },
        jogo: { id: true, nome: true, data: true },
    };

    return {
        async listar(pagina = 1, limite = 10) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                skip, take: limite, order: { id: 'ASC' },
                relations: ['aluno', 'treino', 'jogo'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorAluno(pagina = 1, limite = 10, alunoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { aluno: { id: alunoId } },
                skip, take: limite, order: { data: 'DESC' },
                relations: ['aluno', 'treino', 'jogo'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorTreino(pagina = 1, limite = 10, treinoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { treino: { id: treinoId } },
                skip, take: limite, order: { id: 'ASC' },
                relations: ['aluno', 'treino', 'jogo'],
                select: selectBase,
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['aluno', 'treino', 'jogo'],
                select: selectBase,
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
