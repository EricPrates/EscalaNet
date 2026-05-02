import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Frequencia } from "./frequencia.model";
import { CriarFrequenciaDTO, RespostaFrequenciaDTO } from "./frequencia.schemas";

export interface IFrequenciaRepository extends IBaseRepository<Frequencia, CriarFrequenciaDTO> {
    listarPorJogador(pagina: number, limite: number, jogadorId: number): Promise<{ data: Frequencia[]; total: number }>;
    listarPorTreino(pagina: number, limite: number, treinoId: number): Promise<{ data: Frequencia[]; total: number }>;
}

export interface IFrequenciaService extends IBaseService<RespostaFrequenciaDTO, CriarFrequenciaDTO> {
    listarPorJogador(pagina: number, limite: number, jogadorId: number): Promise<{ data: RespostaFrequenciaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    listarPorTreino(pagina: number, limite: number, treinoId: number): Promise<{ data: RespostaFrequenciaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
