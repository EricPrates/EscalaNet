import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";
import { ITreinoRepository, ITreinoService } from "./treino.interfaces";
import { CriarTreinoDTO, RespostaTreinoDTO, SchemaTreinoResposta } from "./treino.schemas";


export function fazerTreinoService(treinoRepo: ITreinoRepository): ITreinoService {
    return {
        async listarPorNucleo(pagina: number, limite: number, nucleoId: number) {
            const { data, total } = await treinoRepo.listarPorNucleo(pagina, limite, nucleoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },
        async listar(pagina: number, limite: number) {
            const ctx = getContext();
            if (ctx?.permissao !== 'admin' && ctx?.nucleoVinculadoId) {
                return this.listarPorNucleo(pagina, limite, ctx.nucleoVinculadoId);
            }
            const { data, total } = await treinoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },
        async obterPorFiltros(pagina: number, limite: number, where: any) {
            const ctx = getContext();
            if (ctx?.permissao !== 'admin' && ctx?.nucleoVinculadoId) {
                return this.listarPorNucleo(pagina, limite, ctx.nucleoVinculadoId);
            }
            const { data, total } = await treinoRepo.obterPorFiltros(pagina, limite, where);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.obterPorId(id);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            return SchemaTreinoResposta.parse(treino);
        },

        async criar(data: CriarTreinoDTO): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.criar(data);
            return SchemaTreinoResposta.parse(treino);
        },

        async atualizar(id: number, data: CriarTreinoDTO): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.atualizar(id, data);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            return SchemaTreinoResposta.parse(treino);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await treinoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Treino não encontrado');
            return deletado;
        },
    };
}
