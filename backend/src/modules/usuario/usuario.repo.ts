import { DataSource, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IUsuarioRepository } from "./usuario.interfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO } from './usuario.schemas';



export function fazerUsuarioRepo(dataSource: DataSource): IUsuarioRepository {
    const repo = dataSource.getRepository(Usuario);

    return {
        async listarPornucleoVinculado(pagina: number = 1, limite: number = 10, nucleoId: number, relations?: FindOptionsRelations<Usuario>) {
            const skip = (pagina - 1) * limite;

            const [data, total] = await repo.findAndCount({
                where: { nucleoVinculado: { id: nucleoId } },
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },
        async obterPorFiltros(pagina: number, limite: number, where: FindOptionsWhere<Usuario>, relations?: FindOptionsRelations<Usuario>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },
        async listar(pagina: number = 1, limite: number = 10) {
            const skip = (pagina - 1) * limite;

            const [data, total] = await repo.findAndCount({
                skip,
                take: limite,
                order: { id: 'ASC' },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    permissao: true,
                    nucleoVinculado: {
                        id: true,
                        nome: true,
                    },
                },
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            const usuario = await repo.findOne({
                where: { id },
                select: {
                    id: true, nome: true, email: true, permissao: true,
                    nucleoVinculado: { id: true, nome: true }
                }
            });
            return usuario || null;
        },

        async obterPorEmail(email: string) {
            const usuario = await repo.findOne({ where: { email } });
            return usuario || null;
        },

        async criar(data: CriarUsuarioDTO) {
            const usuario = repo.create(data);
            return repo.save(usuario);
        },


        async atualizar(id: number, data: Partial<CriarUsuarioDTO>) {
            const usuario = await repo.findOne({ where: { id } });
            if (!usuario) return null;
            repo.merge(usuario, data as any);
            await repo.save(usuario);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}