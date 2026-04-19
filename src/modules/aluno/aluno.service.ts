import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";
import { IAlunoRepository, IAlunoService } from "./aluno.interfaces";
import { CriarAlunoDTO, RespostaAlunoDTO, SchemaAlunoResposta } from "./aluno.schemas";

function mapearAluno(aluno: any): RespostaAlunoDTO {
    return SchemaAlunoResposta.parse({
        id: aluno.id,
        nome: aluno.nome,
        dataNascimento: aluno.dataNascimento,
        ativo: aluno.ativo,
        telefone: aluno.telefone,
        nucleo: aluno.nucleo ? { id: aluno.nucleo.id, nome: aluno.nucleo.nome } : undefined,
        categoria: aluno.categoria ? { id: aluno.categoria.id, nome: aluno.categoria.nome } : null,
    });
}

export function fazerAlunoService(alunoRepo: IAlunoRepository): IAlunoService {
    return {
        async listar(pagina: number, limite: number) {
            const ctx = getContext();
            // coordenador/professor só veem alunos do seu núcleo
            if (ctx?.permissao !== 'admin' && ctx?.nucleoVinculadoId) {
                return this.listarPorNucleo(pagina, limite, ctx.nucleoVinculadoId);
            }
            const { data, total } = await alunoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaAlunoResposta).parse({
                data: data.map(mapearAluno),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorNucleo(pagina: number, limite: number, nucleoId: number) {
            const { data, total } = await alunoRepo.listarPorNucleo(pagina, limite, nucleoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaAlunoResposta).parse({
                data: data.map(mapearAluno),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorCategoria(pagina: number, limite: number, categoriaId: number) {
            const { data, total } = await alunoRepo.listarPorCategoria(pagina, limite, categoriaId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaAlunoResposta).parse({
                data: data.map(mapearAluno),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.obterPorId(id);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return mapearAluno(aluno);
        },

        async criar(data: CriarAlunoDTO): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.criar(data);
            return mapearAluno(aluno);
        },

        async atualizar(id: number, data: Partial<CriarAlunoDTO>): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.atualizar(id, data);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return mapearAluno(aluno);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await alunoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Aluno não encontrado');
            return deletado;
        },
    };
}
