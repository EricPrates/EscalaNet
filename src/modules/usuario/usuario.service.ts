import { IUsuarioRepository } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO } from './usuario.schemas';
import { gerarRespostaUsuario, gerarRespostaUsuarios } from "./usuario.dto.helper";


export const fazerUsuarioService = (usuarioRepo: IUsuarioRepository) => {

   return {
        async listarUsuarios() : Promise<RespostaUsuarioDTO[]> {
            const usuarios = await usuarioRepo.listarUsuarios();
            if(usuarios.length === 0) {
                throw new AppError(404, 'Nenhum usuário encontrado');
            }
            return gerarRespostaUsuarios(usuarios);
        },

        async obterUsuarioPorId(id: number) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterUsuarioPorId(id);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async obterUsuarioPorEmail(email: string) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterUsuarioPorEmail(email);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async criarUsuario(data: CriarUsuarioDTO) : Promise<RespostaUsuarioDTO> {
            data.senha = await bcrypt.hash(data.senha, 10);
            const verificarEmailNBanco = await usuarioRepo.obterUsuarioPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
           const usuario = await usuarioRepo.criarUsuario(data);
           if (!usuario) {
                throw new AppError(500, 'Erro ao criar usuário');
            }
           return gerarRespostaUsuario(usuario);
        },

        async criarUsuarioSemRetorno(data: CriarUsuarioDTO) : Promise<void> {
            const verificarEmailNBanco = await usuarioRepo.obterUsuarioPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
            data.senha = await bcrypt.hash(data.senha, 10);
            await usuarioRepo.criarUsuarioSemRetorno(data);
        },

        async atualizarUsuario(id: number, data: CriarUsuarioDTO) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.atualizarUsuario(id, data);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async deletarUsuario(id: number) : Promise<boolean>  {
            const deletado = await usuarioRepo.deletarUsuario(id);
            if (!deletado) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return deletado;
        },

         async obterUsuarioParaLogin(email: string, senha: string) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterUsuarioPorEmail(email);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new AppError(401, 'Credenciais inválidas');
            }
            
            return gerarRespostaUsuario(usuario);
        }
    } 
}