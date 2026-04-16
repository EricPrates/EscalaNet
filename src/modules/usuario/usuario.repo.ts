import { DataSource } from "typeorm";
import { IUsuarioRepository } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO } from './usuario.schemas';


export function fazerUsuarioRepo(dataSource: DataSource): IUsuarioRepository {
    const repo = dataSource.getRepository(Usuario);

    return {
        async listar() {
            return repo.find({ order: { id: 'ASC' } });
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

        async criarUsuarioSemRetorno(data: CriarUsuarioDTO) {
            const user = await repo.insert(data);
            if (!user) {
                throw new AppError(500, 'Erro ao criar usuário');
            }
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