import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Aluno } from "./Aluno.model";
import { CriarAlunoDTO, RespostaAlunoDTO } from "./aluno.schemas";

export interface IAlunoRepository extends IBaseRepository<Aluno, CriarAlunoDTO> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: Aluno[]; total: number }>;
    listarPorCategoria(pagina: number, limite: number, categoriaId: number): Promise<{ data: Aluno[]; total: number }>;
}

export interface IAlunoService extends IBaseService<RespostaAlunoDTO, CriarAlunoDTO> {
    listarPorNucleo(pagina: number, limite: number, nucleoId: number): Promise<{ data: RespostaAlunoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    listarPorCategoria(pagina: number, limite: number, categoriaId: number): Promise<{ data: RespostaAlunoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}
