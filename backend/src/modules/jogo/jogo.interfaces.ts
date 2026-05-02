import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Jogo } from "./Jogo.model";
import { CriarJogoDTO, RespostaJogoDTO } from "./jogo.schemas";

export interface IJogoRepository extends IBaseRepository<Jogo, CriarJogoDTO> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: Jogo[]; total: number }>;
    listarPorCategoria(pagina: number, limite: number, categoriaId: number): Promise<{ data: Jogo[]; total: number }>;
}

export interface IJogoService extends IBaseService<RespostaJogoDTO, CriarJogoDTO> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: RespostaJogoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    listarPorCategoria(pagina: number, limite: number, categoriaId: number): Promise<{ data: RespostaJogoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
