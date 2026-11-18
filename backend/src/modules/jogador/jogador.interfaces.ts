

import { FindOptionsRelations, FindOptionsSelect } from "typeorm";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Jogador } from "./jogador.model";
import { CriarJogadorDTO, FiltrosJogadorDTO, RespostaResumidaJogadorDTO } from "./jogador.schemas";

export interface IJogadorRepository extends IBaseRepository<Jogador, CriarJogadorDTO> {
    obterPorCpf(cpf: string, relations?: FindOptionsRelations<Jogador>, select?: FindOptionsSelect<Jogador>): Promise<Jogador | null>;
    obterPorMatricula(matricula: string, relations?: FindOptionsRelations<Jogador>, select?: FindOptionsSelect<Jogador>): Promise<Jogador | null>;
}

export interface IJogadorService extends IBaseService<RespostaResumidaJogadorDTO, FiltrosJogadorDTO, CriarJogadorDTO, number> {
  obterPorCpf(cpf: string, relations?: FindOptionsRelations<Jogador>): Promise<RespostaResumidaJogadorDTO>;
}
