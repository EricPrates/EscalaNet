import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IAlunoRepository, IAlunoService } from "./aluno.interfaces";
import { CriarAlunoDTO, FiltrosAlunoDTO, RespostaResumidaAlunoDTO, SchemaAlunoDetalhado, SchemaAlunoResumido, RespostaAlunoDetalhadoDTO } from './aluno.schemas';
import { fazerAlunoFiltrosERelacoes, includesPermitidos } from './helpers/filtrosErelacoes';





export function fazerAlunoService(alunoRepo: IAlunoRepository): IAlunoService {
    return {

        async listar(pagina: number, limite: number, filtros: FiltrosAlunoDTO, includes: string[] = []): Promise<{ data: RespostaAlunoDetalhadoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            if (includes.some((include) => !includesPermitidos.includes(include))) {
                throw new AppError(400, 'Includes inválidos');
            }
            const { where, relations, select } = fazerAlunoFiltrosERelacoes(filtros, includes);
            const { data, total } = await alunoRepo.listar(pagina, limite, where, relations, select);
            const totalPaginas = Math.ceil(total / limite);
            const dataValidada: RespostaAlunoDetalhadoDTO[] = SchemaAlunoDetalhado.array().parse(data);
            return SchemaRespostaPaginada(SchemaAlunoDetalhado).parse({
                data: dataValidada,
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number, includes: string[] = []): Promise<RespostaResumidaAlunoDTO> {
            if (!includes.some((include) => !includesPermitidos.includes(include))) {
                throw new AppError(400, 'Includes inválidos');
            }
            const filtros: FiltrosAlunoDTO = { id };
            const { relations, select } = fazerAlunoFiltrosERelacoes(filtros, includes);
            const aluno = await alunoRepo.obterPorId(id, relations, select);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoDetalhado.parse(aluno);
        },

        async criar(data: CriarAlunoDTO): Promise<RespostaAlunoDetalhadoDTO> {

            const aluno = await alunoRepo.criar(data);
            return SchemaAlunoDetalhado.parse(aluno);
        },

        async atualizar(id: number, data: Partial<CriarAlunoDTO>): Promise<RespostaResumidaAlunoDTO> {
            const aluno = await alunoRepo.atualizar(id, data);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoResumido.parse(aluno);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await alunoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Aluno não encontrado');
            return deletado;
        },
    };
}
