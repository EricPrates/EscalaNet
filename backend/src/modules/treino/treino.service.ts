import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";
import { ITreinoRepository, ITreinoService } from "./treino.interfaces";
import { CriarTreinoDTO, RespostaTreinoDTO, SchemaTreinoResposta } from "./treino.schemas";

function mapearTreino(treino: any): RespostaTreinoDTO {
    return SchemaTreinoResposta.parse({
        id: treino.id,
        data: treino.data,
        nucleo: treino.nucleo ? { id: treino.nucleo.id, nome: treino.nucleo.nome } : undefined,
    });
}

export function fazerTreinoService(treinoRepo: ITreinoRepository): ITreinoService {
    return {
        async listar(pagina: number, limite: number) {
            const ctx = getContext();
            if (ctx?.permissao !== 'admin' && ctx?.nucleoVinculadoId) {
                return this.listarPorNucleo(pagina, limite, ctx.nucleoVinculadoId);
            }
            const { data, total } = await treinoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data.map(mapearTreino),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorNucleo(pagina: number, limite: number, nucleoId: number) {
            const { data, total } = await treinoRepo.listarPorNucleo(pagina, limite, nucleoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data.map(mapearTreino),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.obterPorId(id);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            return mapearTreino(treino);
        },

        async criar(data: CriarTreinoDTO): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.criar(data);
            return mapearTreino(treino);
        },

        async atualizar(id: number, data: Partial<CriarTreinoDTO>): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.atualizar(id, data);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            return mapearTreino(treino);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await treinoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Treino não encontrado');
            return deletado;
        },
    };
}
