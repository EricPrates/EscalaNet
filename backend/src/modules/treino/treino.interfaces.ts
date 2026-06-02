import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Treino } from "./Treino.model";
import { CriarTreinoDTO, FiltrosTreinoDTO, RespostaTreinoDTO } from "./treino.schemas";

export interface ITreinoRepository extends IBaseRepository<Treino, CriarTreinoDTO> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: Treino[]; total: number }>;
}

export interface ITreinoService extends IBaseService<RespostaTreinoDTO, FiltrosTreinoDTO, CriarTreinoDTO, number> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: RespostaTreinoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
