import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Frequencia } from "./frequencia.model";
import { CriarFrequenciaDTO, RespostaFrequenciaDTO } from "./frequencia.schemas";

export interface IFrequenciaRepository extends IBaseRepository<Frequencia, CriarFrequenciaDTO> {

}

export interface IFrequenciaService extends IBaseService<RespostaFrequenciaDTO, CriarFrequenciaDTO> {
 
}
