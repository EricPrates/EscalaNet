
import { CriarNucleoDTO, RespostaNucleoDTO, DashboardNucleoDTO } from "./nucleo.schemas";
import { IBaseRepository } from "../../shared/factory/BaseInterfaces";

export interface INucleoService extends IBaseRepository<RespostaNucleoDTO, CriarNucleoDTO> {
    obterDadosDashboard(id: number): Promise<DashboardNucleoDTO>;
}