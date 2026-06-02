
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Classificacao } from "./Classificacao.model";
import { CriarClassificacaoDTO, FiltrosClassificacaoDTO, RespostaClassificacaoDTO } from "./classificacao.schemas";

export interface IClassificacaoRepository extends IBaseRepository<Classificacao, CriarClassificacaoDTO> {
  
}
export interface IClassificacaoService extends IBaseService<RespostaClassificacaoDTO, FiltrosClassificacaoDTO, CriarClassificacaoDTO, number> {
 
   // calcularClassificacao(competicaoId: number): Promise<RespostaClassificacaoDTO[]>;
}
