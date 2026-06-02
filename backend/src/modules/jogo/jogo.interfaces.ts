import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { FiltrosJogadorDTO } from "../jogador/jogador.schemas";
import { Jogo } from "./Jogo.model";
import { CriarJogoDTO, RespostaJogoDTO } from "./jogo.schemas";

export interface IJogoRepository extends IBaseRepository<Jogo, CriarJogoDTO> {

}

export interface IJogoService extends IBaseService<RespostaJogoDTO, FiltrosJogadorDTO, CriarJogoDTO> {
}