import { CriarNucleoDTO, DashboardNucleoDTO, FiltrosNucleoDTO, RespostaNucleoDTO } from "./nucleo.schemas";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Nucleo } from "./Nucleo.model";


export interface INucleoRepository extends IBaseRepository<Nucleo, CriarNucleoDTO> {
    obterPorNome(nome: string): Promise<Nucleo | null>;
    obterDashboard(nucleoId: number): Promise<DashboardNucleoDTO>;
}

export interface INucleoService extends IBaseService<RespostaNucleoDTO, FiltrosNucleoDTO, CriarNucleoDTO> {
    obterPorNome(nome: string): Promise<RespostaNucleoDTO | null>;
    obterDashboard(nucleoId: number): Promise<DashboardNucleoDTO>;
}