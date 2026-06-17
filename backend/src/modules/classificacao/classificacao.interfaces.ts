
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Classificacao } from "./Classificacao.model";
import { CriarClassificacaoDTO, FiltrosClassificacaoDTO, RespostaClassificacaoDTO } from "./classificacao.schemas";

export interface IClassificacaoRepository extends IBaseRepository<Classificacao, CriarClassificacaoDTO> {
  buscarPorCompeticaoETime(competicaoId: number, timeId: number): Promise<Classificacao | null>
}
export interface IClassificacaoService extends IBaseService<RespostaClassificacaoDTO, FiltrosClassificacaoDTO, CriarClassificacaoDTO, number> {
 
  
}
