import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Frequencia } from "./frequencia.model";
import { CriarFrequenciaDTO, FiltrosFrequenciaDTO, RespostaFrequenciaDTO } from "./frequencia.schemas";

export interface IFrequenciaRepository extends IBaseRepository<Frequencia, CriarFrequenciaDTO> {
    listarPorJogador(pagina: number, limite: number, jogadorId: number): Promise<{ data: Frequencia[]; total: number }>;
}

export interface IFrequenciaService extends IBaseService<RespostaFrequenciaDTO, FiltrosFrequenciaDTO, CriarFrequenciaDTO, number> {
    listarPorJogador(pagina: number, limite: number, jogadorId: number): Promise<{ data: RespostaFrequenciaDTO[]; meta: any }>;
}
