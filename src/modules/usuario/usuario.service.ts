import { IUsuarioRepository, IUsuarioService } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import { gerarRespostaUsuarios } from "./usuario.dto.helper";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO } from './usuario.schemas';
import { gerarRespostaUsuario} from "./usuario.dto.helper";


export const fazerUsuarioService = (usuarioRepo: IUsuarioRepository) : IUsuarioService => {

   return {
        async listar() : Promise<RespostaUsuarioDTO[]> {
            const usuarios = await usuarioRepo.listar();
            if(usuarios.length === 0) {
                throw new AppError(404, 'Nenhum usuário encontrado');
            }
            return gerarRespostaUsuarios(usuarios);
        },

        async obterPorId(id: number) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorId(id);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async obterPorEmail(email: string) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorEmail(email);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async criar(data: CriarUsuarioDTO) : Promise<RespostaUsuarioDTO> {
            data.senha = await bcrypt.hash(data.senha, 10);
            const verificarEmailNBanco = await usuarioRepo.obterPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
           const usuario = await usuarioRepo.criar(data);
           if (!usuario) {
                throw new AppError(500, 'Erro ao criar usuário');
            }
           return gerarRespostaUsuario(usuario);
        },

        async criarUsuarioSemRetorno(data: CriarUsuarioDTO) : Promise<void> {
            const verificarEmailNBanco = await usuarioRepo.obterPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
            data.senha = await bcrypt.hash(data.senha, 10);
            await usuarioRepo.criarUsuarioSemRetorno(data);
        },

        async atualizar(id: number, data: CriarUsuarioDTO) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.atualizar(id, data);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return gerarRespostaUsuario(usuario);
        },

        async deletar(id: number) : Promise<boolean>  {
            const deletado = await usuarioRepo.deletar(id);
            if (!deletado) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return deletado;
        },

         async obterUsuarioParaLogin(email: string, senha: string) : Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorEmail(email);
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