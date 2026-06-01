import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO, RespostaChamadaDTO, FiltrosChamadaDTO } from "./chamada.schemas";

export interface IChamadaRepository extends IBaseRepository<Chamada, CriarChamadaDTO> {
   obterPorFiltro(filtro: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<Chamada | null>;
}
export interface IChamadaService extends IBaseService<RespostaChamadaDTO, FiltrosChamadaDTO, CriarChamadaDTO, number> {
    obterPorFiltro(filtro: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<RespostaChamadaDTO>;
    obterPorData(filtro: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<RespostaChamadaDTO>;
}
