import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";

import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO } from "./aluno.schema";

export interface IAlunoRepository extends IBaseRepository<Aluno, CriarAlunoDTO> {
    obterPorNome(nome: string): Promise<Aluno | null>;
   
}

export interface IAlunoService extends IBaseService<Aluno, CriarAlunoDTO> {
    
    obterPorNome(nome: string): Promise<Aluno>;
    
}