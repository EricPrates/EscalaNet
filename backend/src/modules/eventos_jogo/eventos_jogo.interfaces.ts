import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { EventosJogo } from "./EventosJogo.model";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO } from "./eventos_jogo.schemas";

export interface IEventoJogoRepository extends IBaseRepository<EventosJogo, CriarEventoJogoDTO> {
   
}

export interface IEventoJogoService extends IBaseService<RespostaEventoJogoDTO, CriarEventoJogoDTO> {
   
}
