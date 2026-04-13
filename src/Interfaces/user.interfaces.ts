import { Usuario } from "../Models/Usuario";
import { CriarUsuarioDTO, RespostaUsuarioDTO } from "../Schemas/user.schemas";


export interface IUsuarioRepository {
    listarUsuarios(): Promise<Usuario[]>;
    obterUsuarioPorId(id: number): Promise<Usuario | null>;
    obterUsuarioPorEmail(email: string): Promise<Usuario | null>;
    criarUsuario(data: CriarUsuarioDTO): Promise<Usuario>;
    criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void>;
    atualizarUsuario(id: number, data: CriarUsuarioDTO): Promise<Usuario | null>;
    deletarUsuario(id: number): Promise<boolean>;
}

export interface IUsuarioService {
    listarUsuarios(): Promise<RespostaUsuarioDTO[]>;
    obterUsuarioPorId(id: number): Promise<RespostaUsuarioDTO>;
    obterUsuarioPorEmail(email: string): Promise<RespostaUsuarioDTO>;
    criarUsuario(data: CriarUsuarioDTO): Promise<RespostaUsuarioDTO>;
    criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void>;
    atualizarUsuario(id: number, data: CriarUsuarioDTO): Promise<RespostaUsuarioDTO>;
    deletarUsuario(id: number): Promise<boolean>;
    obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO>;
}