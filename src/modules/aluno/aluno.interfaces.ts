
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO, RespostaAlunoDTO } from "./aluno.schemas";

export interface IAlunoRepository extends IBaseRepository<Aluno, CriarAlunoDTO> {
  
 
}

export interface IAlunoService extends IBaseService<RespostaAlunoDTO, CriarAlunoDTO> {
 
  
}
