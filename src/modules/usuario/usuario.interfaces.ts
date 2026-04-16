import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO, RespostaUsuarioDTO } from "./usuario.schemas";


export interface IUsuarioRepository extends IBaseRepository<Usuario, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<Usuario | null>;
    criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void>;
    
}

export interface IUsuarioService extends IBaseService<RespostaUsuarioDTO, CriarUsuarioDTO> {
    
    obterPorEmail(email: string): Promise<RespostaUsuarioDTO>;
    criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void>;
    obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO>;
    
}

