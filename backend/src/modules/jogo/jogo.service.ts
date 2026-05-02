import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";
import { IJogoRepository, IJogoService } from "./jogo.interfaces";
import { CriarJogoDTO, RespostaJogoDTO, SchemaJogoResposta } from "./jogo.schemas";

function mapearJogo(jogo: any): RespostaJogoDTO {
    return SchemaJogoResposta.parse({
        id: jogo.id,
        nome: jogo.nome,
        data: jogo.data,
        timeA: jogo.timeA ? { id: jogo.timeA.id, nome: jogo.timeA.nome } : undefined,
        timeB: jogo.timeB ? { id: jogo.timeB.id, nome: jogo.timeB.nome } : undefined,
        arbitro: jogo.arbitro ? { id: jogo.arbitro.id, nome: jogo.arbitro.nome } : null,
        categoria: jogo.categoria ? { id: jogo.categoria.id, nome: jogo.categoria.nome } : null,
        golsTimeA: jogo.golsTimeA,
        golsTimeB: jogo.golsTimeB,
    });
}

export function fazerJogoService(jogoRepo: IJogoRepository): IJogoService {
    return {
        async listar(pagina: number, limite: number) {
            const ctx = getContext();
            if (ctx?.permissao !== 'admin' && ctx?.nucleoVinculadoId) {
                return this.listarPorNucleo(pagina, limite, ctx.nucleoVinculadoId);
            }
            const { data, total } = await jogoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogoResposta).parse({
                data: data.map(mapearJogo),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorNucleo(pagina: number, limite: number, nucleoId: number) {
            const { data, total } = await jogoRepo.listarPorNucleo(pagina, limite, nucleoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogoResposta).parse({
                data: data.map(mapearJogo),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorCategoria(pagina: number, limite: number, categoriaId: number) {
            const { data, total } = await jogoRepo.listarPorCategoria(pagina, limite, categoriaId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogoResposta).parse({
                data: data.map(mapearJogo),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaJogoDTO> {
            const jogo = await jogoRepo.obterPorId(id);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return mapearJogo(jogo);
        },

        async criar(data: CriarJogoDTO): Promise<RespostaJogoDTO> {
            if (data.timeA.id === data.timeB.id) throw new AppError(400, 'Time A e Time B não podem ser o mesmo núcleo');
            const jogo = await jogoRepo.criar(data);
            return mapearJogo(jogo);
        },

        async atualizar(id: number, data: Partial<CriarJogoDTO>): Promise<RespostaJogoDTO> {
            const jogo = await jogoRepo.atualizar(id, data);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return mapearJogo(jogo);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await jogoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Jogo não encontrado');
            return deletado;
        },
    };
}
