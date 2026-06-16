import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Treino } from "./Treino.model";
import { CriarTreinoDTO, FiltrosTreinoDTO, RespostaTreinoDTO } from "./treino.schemas";

export interface ITreinoRepository extends IBaseRepository<Treino, CriarTreinoDTO> {
}

export interface ITreinoService extends IBaseService<RespostaTreinoDTO, FiltrosTreinoDTO, CriarTreinoDTO, number> {
   
}
