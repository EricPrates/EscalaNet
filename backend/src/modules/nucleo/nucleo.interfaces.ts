
import { CriarNucleoDTO, FiltrosNucleoDTO, RespostaNucleoDTO } from "./nucleo.schemas";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Nucleo } from "./Nucleo.model";


export interface INucleoRepository extends IBaseRepository<Nucleo, CriarNucleoDTO, number> {
    obterPorNome(nome: string): Promise<Nucleo | null>;
   
}

export interface INucleoService extends IBaseService<RespostaNucleoDTO,FiltrosNucleoDTO, CriarNucleoDTO, number> {
    
    obterPorNome(nome: string): Promise<RespostaNucleoDTO>;
    
}