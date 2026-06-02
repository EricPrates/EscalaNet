// src/modules/postagem/postagem.service.ts
import { AppError } from '../../shared/utils/AppError';
import { montarPaginacao } from '../../shared/utils/montarPaginacao';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { IPostagemRepository, IPostagemService } from './postagem.interfaces';
import { CriarPostagemDTO,  SchemaPostagemResposta, SchemaPostagensPaginadas } from './postagem.schemas';
import { FindOptionsWhere, FindOptionsRelations, LessThanOrEqual } from 'typeorm';
import { Postagem } from './postagem.model';

export function fazerPostagemService(repo: IPostagemRepository): IPostagemService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>) {
            const { data, total } = await repo.listar(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaPostagemResposta).parse({
                data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },
        async obterPorFiltros(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>) {
            const { data, total } = await repo.obterPorFiltros(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaPostagemResposta).parse({
                data,
                meta: montarPaginacao(pagina, limite, total)
            });
        },
        async listarPublicados(pagina: number, limite: number) {
            const where: FindOptionsWhere<Postagem> = {
                status: 'publicado',
                publicadoEm: LessThanOrEqual(new Date())
            };
            const { data, total } = await repo.listar(pagina, limite, where);
            return SchemaPostagensPaginadas.parse({
                data,
                meta: montarPaginacao(pagina, limite, total)
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Postagem>) {
            const postagem = await repo.obterPorId(id, relations);
            if (!postagem) throw new AppError(404, 'Postagem não encontrada');
            return SchemaPostagemResposta.parse(postagem);
        },

        async criar(data: CriarPostagemDTO) {
            // Se status for 'publicado' e não tiver data, define a data atual
            if (data.status === 'publicado' && !data.publicadoEm) {
                data.publicadoEm = new Date();
            }
            const postagem = await repo.criar(data);
            return SchemaPostagemResposta.parse(postagem);
        },

        async atualizar(id: number, data: Partial<CriarPostagemDTO>) {
            const postagem = await repo.atualizar(id, data);
            if (!postagem) throw new AppError(404, 'Postagem não encontrada');
            return SchemaPostagemResposta.parse(postagem);
        },

        async deletar(id: number) {
            const deletado = await repo.deletar(id);
            if (!deletado) throw new AppError(404, 'Postagem não encontrada');
            return true;
        }
    };
}