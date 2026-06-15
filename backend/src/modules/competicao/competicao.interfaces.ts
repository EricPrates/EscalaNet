import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Competicao } from "./Competicao.model";
import { CriarCompeticaoDTO, FiltrosCompeticaoDTO, RespostaCompeticaoDTO } from "./competicao.schemas";
import { RespostaJogoDTO } from "../jogo/jogo.schemas";


export interface ICompeticaoRepository extends IBaseRepository<Competicao, CriarCompeticaoDTO> {
    vincularTimes(id: number, timeIds: number[]): Promise<Competicao | null>;
    obterPorIdComTimes(id: number): Promise<Competicao | null>;

}

export interface ICompeticaoService extends IBaseService<RespostaCompeticaoDTO, FiltrosCompeticaoDTO, CriarCompeticaoDTO, number> {
    gerarJogos(id: number, dataInicio: Date): Promise<RespostaJogoDTO[]>;
    vincularTimes(id: number, timeIds: number[]): Promise<RespostaCompeticaoDTO>;
    recalcularClassificacao(id: number): Promise<RespostaCompeticaoDTO>;
}