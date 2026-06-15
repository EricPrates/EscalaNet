import { FindOptionsWhere } from "typeorm";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { FiltrosJogadorDTO } from "../jogador/jogador.schemas";
import { Jogo } from "./Jogo.model";
import { CriarJogoDTO, RespostaJogoDTO } from "./jogo.schemas";

export interface IJogoRepository extends IBaseRepository<Jogo, CriarJogoDTO> {
    contar(where?: FindOptionsWhere<Jogo>): Promise<number>;

}

export interface IJogoService extends IBaseService<RespostaJogoDTO, FiltrosJogadorDTO, CriarJogoDTO> {
    contar(where?: FindOptionsWhere<Jogo>): Promise<number>;
    
}