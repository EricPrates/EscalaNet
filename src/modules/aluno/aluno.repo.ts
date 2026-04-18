import { FindOptionsWhere} from 'typeorm';
import { Aluno } from './Aluno.model';
import { IAlunoRepository } from './aluno.interfaces';
import { DataSource } from 'typeorm/browser';


export function fazerAlunoRepo(dataSource: DataSource): IAlunoRepository {
    const repo = dataSource.getRepository(Aluno);
    return {
        async obterPorNome(nome: string) {
            const aluno = await repo.findOne({ where: { nome }, relations: ['nucleo', 'categoria'] });
            return aluno || null;
        },
        async listar(pagina: number, limite: number, where: FindOptionsWhere<Aluno> = {}) {
            const [data, total] = await repo.findAndCount({
                where,
                relations: ['nucleo', 'categoria'],
                skip: (pagina - 1) * limite,
                take: limite,
                order: { nome: 'ASC' }
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            return repo.findOne({ where: { id }, relations: ['nucleo', 'categoria'] });
        },

        async criar(data: Partial<Aluno>) {
            const aluno = repo.create(data);
            return repo.save(aluno);
        },

        async atualizar(id: number, data: Partial<Aluno>) {
            await repo.update(id, data);
            return repo.findOne({ where: { id }, relations: ['nucleo', 'categoria'] });
        },

        async deletar(id: number) {
            const result = await repo.delete(id);
            return result.affected === 1;
        }
    }
}