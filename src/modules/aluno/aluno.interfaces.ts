

import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO, RespostaResumidaAlunoDTO } from "./aluno.schemas";

export interface IAlunoRepository extends IBaseRepository<Aluno, CriarAlunoDTO> {
 
}

export interface IAlunoService extends IBaseService<RespostaResumidaAlunoDTO, CriarAlunoDTO> {
 
  
}
