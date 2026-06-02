// src/modules/postagem/postagem.repo.ts
import { DataSource, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { Postagem } from './postagem.model';
import { CriarPostagemDTO } from './postagem.schemas';
import { IPostagemRepository } from './postagem.interfaces';

export function fazerPostagemRepo(dataSource: DataSource): IPostagemRepository {
    const repo = dataSource.getRepository(Postagem);

    return {
        async listar(pagina = 1, limite = 10, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { publicadoEm: 'DESC', createdAt: 'DESC' }
            });
            return { data, total };
        },
        async obterPorFiltros(pagina = 1, limite = 10, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { publicadoEm: 'DESC', createdAt: 'DESC' }
            });
            return { data, total };
        },
        async listarPublicados() {
            return repo.find({ where: { status: 'publicado' }, order: { publicadoEm: 'DESC' } });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Postagem>) {
            return await repo.findOne({ where: { id }, relations }) || null;
        },

        async criar(data: CriarPostagemDTO) {
            const postagem = repo.create(data);
            return repo.save(postagem);
        },

        async atualizar(id: number, data: Partial<CriarPostagemDTO>) {
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}