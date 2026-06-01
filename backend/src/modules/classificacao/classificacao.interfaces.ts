import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Classificacao } from "./Classificacao.model";
import { CriarClassificacaoDTO, FiltrosClassificacaoDTO, RespostaClassificacaoDTO } from "./classificacao.schemas";

export interface IClassificacaoRepository extends IBaseRepository<Classificacao, CriarClassificacaoDTO> {
   obterPorFiltro(filtro: FindOptionsWhere<Classificacao>, relations?: FindOptionsRelations<Classificacao>): Promise<Classificacao | null>;

}
export interface IClassificacaoService extends IBaseService<RespostaClassificacaoDTO, FiltrosClassificacaoDTO, CriarClassificacaoDTO, number> {
    obterPorFiltro(filtro: FindOptionsWhere<Classificacao>, relations?: FindOptionsRelations<Classificacao>): Promise<RespostaClassificacaoDTO>;
   // calcularClassificacao(competicaoId: number): Promise<RespostaClassificacaoDTO[]>;
}
