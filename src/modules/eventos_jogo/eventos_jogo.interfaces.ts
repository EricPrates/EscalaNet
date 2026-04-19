import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { EventosJogo } from "./EventosJogo.model";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO } from "./eventos_jogo.schemas";

export interface IEventoJogoRepository extends IBaseRepository<EventosJogo, CriarEventoJogoDTO> {
    listarPorJogo(pagina: number, limite: number, jogoId: number): Promise<{ data: EventosJogo[]; total: number }>;
}

export interface IEventoJogoService extends IBaseService<RespostaEventoJogoDTO, CriarEventoJogoDTO> {
    listarPorJogo(pagina: number, limite: number, jogoId: number): Promise<{ data: RespostaEventoJogoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
