

import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Jogador } from "./jogador.model";
import { CriarJogadorDTO, RespostaResumidaJogadorDTO } from "./jogador.schemas";

export interface IJogadorRepository extends IBaseRepository<Jogador, CriarJogadorDTO> {
 
}

export interface IJogadorService extends IBaseService<RespostaResumidaJogadorDTO, CriarJogadorDTO> {
 
  
}
