import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO } from "./aluno.schemas";
import { IAlunoRepository } from "./aluno.interfaces";




export function fazerAlunoRepo(dataSource: DataSource): IAlunoRepository {
    const repo = dataSource.getRepository(Aluno);

  

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Aluno>, relations?: FindOptionsRelations<Aluno>, select?: FindOptionsSelect<Aluno>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                select,
                skip,
                take: limite,
                order: { nome: 'ASC' },
            });
            return { data, total };
        },
      
        async obterPorId(id: number, relations?: FindOptionsRelations<Aluno>, select?: FindOptionsSelect<Aluno>) {
            return await repo.findOne({
                where: { id },
                relations,
                select,
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
