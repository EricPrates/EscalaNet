import { DataSource, FindOptionsWhere } from "typeorm";
import { IUsuarioRepository } from "./usuario.interfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO } from './usuario.schemas';



export function fazerUsuarioRepo(dataSource: DataSource): IUsuarioRepository {
    const repo = dataSource.getRepository(Usuario);

    return {
        async listar(pagina: number = 1, limite: number = 10, where: FindOptionsWhere<Usuario> = {}) {
            const skip = (pagina - 1) * limite;

            const [data, total] = await repo.findAndCount({
                where,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },

        async obterPorId(id: number) {
            const usuario = await repo.findOne({ where: { id } });
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
            await repo.update({ id }, data);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}