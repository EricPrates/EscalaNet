
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO, FiltrosUsuarioDTO, RespostaUsuarioDTO } from "./usuario.schemas";
import { FindOptionsRelations } from 'typeorm';


export interface IUsuarioRepository extends IBaseRepository<Usuario, CriarUsuarioDTO> {
    obterPorEmail(email: string): Promise<Usuario | null>;
    listarPornucleoVinculado(pagina: number, limite: number, nucleoId: number, relations?: FindOptionsRelations<Usuario>): Promise<{ data: Usuario[]; total: number }>;
}

export interface IUsuarioService extends IBaseService<RespostaUsuarioDTO, FiltrosUsuarioDTO, CriarUsuarioDTO, number> {
    obterPorEmail(email: string): Promise<RespostaUsuarioDTO>;
    obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO>;
    listarPornucleoVinculado(pagina: number, limite: number, relations?: FindOptionsRelations<Usuario>): Promise<{ data: RespostaUsuarioDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
