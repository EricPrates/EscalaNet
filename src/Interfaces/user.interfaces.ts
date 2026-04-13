import { Usuario } from "../Models/Usuario";


export interface IUsuarioRepository {
    buscarTodos(): Promise<Usuario[]>;
    buscarPorId(id: number): Promise<Usuario | null>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    criarUsuarioComRetornoUsuario(data: Partial<Usuario>): Promise<Usuario>;
    criarUsuarioSemRetornoUsuario(data: Partial<Usuario>): Promise<void>;
    atualizarUsuario(id: number, data: Partial<Usuario>): Promise<Usuario | null>;
    deletarUsuario(id: number): Promise<boolean>;
}

export interface IUserService {
    listarUsuarios(): Promise<Usuario[]>;
    obterUsuarioPorId(id: number): Promise<Usuario | null>;
    obterUsuarioPorEmail(email: string): Promise<Usuario | null>;
    criarUsuario(data: Partial<Usuario>): Promise<Usuario>;
    criarUsuarioSemRetorno(data: Partial<Usuario>): Promise<void>;
    atualizarUsuario(id: number, data: Partial<Usuario>): Promise<Usuario | null>;
    deletarUsuario(id: number): Promise<boolean>;
}