
import { CriarNucleoDTO, RespostaNucleoDTO, DashboardNucleoDTO } from "./nucleo.schemas";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Nucleo } from "./Nucleo.model";


export interface INucleoRepository extends IBaseRepository<Nucleo, CriarNucleoDTO> {
    obterPorNome(nome: string): Promise<Nucleo | null>;
    criarNucleoSemRetorno(data: CriarNucleoDTO): Promise<void>;
}

export interface INucleoService extends IBaseService<RespostaNucleoDTO, CriarNucleoDTO> {
    
    obterPorNome(nome: string): Promise<RespostaNucleoDTO>;
    criarNucleoSemRetorno(data: CriarNucleoDTO): Promise<void>;
}