import { DataSource } from "typeorm";
import { IUsuarioRepository } from "../Interfaces/user.interfaces";
import { AppError } from "../Models/AppError";
import { Usuario } from "../Models/Usuario";
import { CriarUsuarioDTO } from '../Schemas/user.schemas';


export function fazerUsuarioRepo(dataSource: DataSource): IUsuarioRepository {
    const repo = dataSource.getRepository(Usuario);

    return {
        async listarUsuarios() {
            return repo.find();
        },

        async obterUsuarioPorId(id: number) {
            const usuario = await repo.findOne({ where: { id } });
            return usuario || null;
        },

        async obterUsuarioPorEmail(email: string) {
            const usuario = await repo.findOne({ where: { email } });
            return usuario || null;
        },

        async criarUsuario(data: CriarUsuarioDTO) {
            const usuario = repo.create(data);
            return repo.save(usuario);
        },

        async criarUsuarioSemRetorno(data: CriarUsuarioDTO) {
            const user = await repo.insert(data);
            if (!user) {
                throw new AppError(500, 'Erro ao criar usuário');
            }
        },

        async atualizarUsuario(id: number, data: Partial<CriarUsuarioDTO>) {
            await repo.update({ id }, data);
            return this.obterUsuarioPorId(id);
        },

        async deletarUsuario(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}