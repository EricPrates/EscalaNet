import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { EventosJogo } from "./EventosJogo.model";
import { CriarEventoJogoDTO, FiltrosEventoJogoDTO, RespostaEventoJogoDTO } from "./eventos_jogo.schemas";

export interface IEventoJogoRepository extends IBaseRepository<EventosJogo, CriarEventoJogoDTO, number> {
   
}

export interface IEventoJogoService extends IBaseService<RespostaEventoJogoDTO, FiltrosEventoJogoDTO, CriarEventoJogoDTO, number> {}
