import { IUsuarioRepository } from "../Interfaces/user.interfaces";
import { Usuario } from "../Models/Usuario";
import { CriarUsuarioDTO } from '../Schemas/user.schemas';
import { AppDataSource } from "../data-source";

const repo = AppDataSource.getRepository(Usuario);
export const UsuarioRepository : IUsuarioRepository = {

    async listarUsuarios(): Promise<Usuario[]> {
        return await repo.find();
    },
    async obterUsuarioPorId(id: number): Promise<Usuario | null> {
        const usuario = await repo.findOne({ where: { id } });
        return usuario || null;
    },

    async obterUsuarioPorEmail(email: string): Promise<Usuario | null> {
        const usuario = await repo.findOne({ where: { email } });
        return usuario || null;
    },

    async criarUsuario(data: CriarUsuarioDTO): Promise<Usuario> {
        const usuario = repo.create(data);
        return await repo.save(usuario);
    },
    async criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void> {
       await repo.insert(data);
    },

    async atualizarUsuario(id: number, data: Partial<CriarUsuarioDTO>): Promise<Usuario | null> {
        const result = await repo.update({ id }, data);
        return result ? await this.obterUsuarioPorId(id) : null;
    },

   async deletarUsuario(id: number): Promise<boolean> {
        const result = await repo.delete({ id });
        return (result.affected ?? 0) > 0;
    }
}