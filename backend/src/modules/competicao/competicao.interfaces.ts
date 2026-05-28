import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Competicao } from "./Competicao.model";
import { CriarCompeticaoDTO, FiltrosCompeticaoDTO, RespostaCompeticaoDTO } from "./competicao.schemas";

export interface ICompeticaoRepository extends IBaseRepository<Competicao, CriarCompeticaoDTO> {
}

export interface ICompeticaoService extends IBaseService<RespostaCompeticaoDTO, FiltrosCompeticaoDTO, CriarCompeticaoDTO, number> {
}