
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO, RespostaUsuarioDTO } from "./usuario.schemas";


export interface IUsuarioRepository extends IBaseRepository<Usuario, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<Usuario | null>;
    
    
}

export interface IUsuarioService extends IBaseService<RespostaUsuarioDTO, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<RespostaUsuarioDTO>;
    obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO>;
    
}

export interface ListarUsuariosFiltros {
    nucleoId?: number;    
    permissao?: string;    
    busca?: string;        
}