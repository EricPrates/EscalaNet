
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO, RespostaUsuarioDTO } from "./usuario.schemas";


export interface IUsuarioRepository extends IBaseRepository<Usuario, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<Usuario | null>;
    listarPornucleoVinculado(pagina: number, limite: number, nucleoId: number): Promise<{ data: Usuario[]; total: number }>;
    
}

export interface IUsuarioService extends IBaseService<RespostaUsuarioDTO, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<RespostaUsuarioDTO>;
    obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO>;
    listarPornucleoVinculado(pagina: number, limite: number): Promise<{ data: RespostaUsuarioDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    
}

export interface ListarUsuariosFiltros {
    nucleoId?: number;    
    permissao?: string;    
    busca?: string;        
}