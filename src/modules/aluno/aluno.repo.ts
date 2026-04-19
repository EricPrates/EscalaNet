import { DataSource } from "typeorm";
import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO } from "./aluno.schemas";
import { IAlunoRepository } from "./aluno.interfaces";

export function fazerAlunoRepo(dataSource: DataSource): IAlunoRepository {
    const repo = dataSource.getRepository(Aluno);

    const selectBase = {
        id: true, nome: true, dataNascimento: true, ativo: true, telefone: true,
        nucleo: { id: true, nome: true },
        categoria: { id: true, nome: true },
    };

    return {
        async listar(pagina = 1, limite = 10) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorNucleo(pagina = 1, limite = 10, nucleoId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { nucleo: { id: nucleoId } },
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async listarPorCategoria(pagina = 1, limite = 10, categoriaId: number) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where: { categoria: { id: categoriaId } },
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo', 'categoria'],
                select: selectBase,
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return await repo.findOne({
                where: { id },
                relations: ['nucleo', 'categoria'],
                select: selectBase,
            }) || null;
        },

        async criar(data: CriarAlunoDTO) {
            const aluno = repo.create(data);
            return repo.save(aluno);
        },

        async atualizar(id: number, data: Partial<CriarAlunoDTO>) {
            const aluno = await repo.findOne({ where: { id } });
            if (!aluno) return null;
            repo.merge(aluno, data);
            await repo.save(aluno);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
