import { FindOptionsWhere } from "typeorm";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";

import { Jogo } from "./Jogo.model";
import { CriarJogoDTO, FiltrosJogoDTO, RespostaJogoDTO } from "./jogo.schemas";

export interface IJogoRepository extends IBaseRepository<Jogo, CriarJogoDTO> {
    contar(where?: FindOptionsWhere<Jogo>): Promise<number>;

}

export interface IJogoService extends IBaseService<RespostaJogoDTO, FiltrosJogoDTO, CriarJogoDTO, number> {
    contar(where?: FindOptionsWhere<Jogo>): Promise<number>;
}