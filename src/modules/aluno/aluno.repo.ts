import { DataSource, FindOptionsWhere } from "typeorm";
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
        async listar(pagina: number = 1, limite: number = 10, where: FindOptionsWhere<Aluno> = {}) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                skip, take: limite, order: { id: 'ASC' },
                relations: ['nucleo', 'categoria'],
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
