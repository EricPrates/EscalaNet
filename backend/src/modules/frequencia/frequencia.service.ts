import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IFrequenciaRepository, IFrequenciaService } from "./frequencia.interfaces";
import { CriarFrequenciaDTO, RespostaFrequenciaDTO, SchemaFrequenciaResposta } from "./frequencia.schemas";

function mapearFrequencia(f: any): RespostaFrequenciaDTO {
    return SchemaFrequenciaResposta.parse({
        id: f.id,
        data: f.data,
        presente: f.presente,
        jogador: f.jogador ? { id: f.jogador.id, nome: f.jogador.nome } : undefined,
        treino: f.treino ? { id: f.treino.id, data: f.treino.data } : undefined,
        jogo: f.jogo ? { id: f.jogo.id, nome: f.jogo.nome, data: f.jogo.data } : null,
    });
}

export function fazerFrequenciaService(frequenciaRepo: IFrequenciaRepository): IFrequenciaService {
    return {
        async listar(pagina: number, limite: number) {
            const { data, total } = await frequenciaRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data.map(mapearFrequencia),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorJogador(pagina: number, limite: number, jogadorId: number) {
            const { data, total } = await frequenciaRepo.listarPorJogador(pagina, limite, jogadorId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data.map(mapearFrequencia),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorTreino(pagina: number, limite: number, treinoId: number) {
            const { data, total } = await frequenciaRepo.listarPorTreino(pagina, limite, treinoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data.map(mapearFrequencia),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaFrequenciaDTO> {
            const f = await frequenciaRepo.obterPorId(id);
            if (!f) throw new AppError(404, 'Frequência não encontrada');
            return mapearFrequencia(f);
        },

        async criar(data: CriarFrequenciaDTO): Promise<RespostaFrequenciaDTO> {
            const f = await frequenciaRepo.criar(data);
            return mapearFrequencia(f);
        },

        async atualizar(id: number, data: Partial<CriarFrequenciaDTO>): Promise<RespostaFrequenciaDTO> {
            const f = await frequenciaRepo.atualizar(id, data);
            if (!f) throw new AppError(404, 'Frequência não encontrada');
            return mapearFrequencia(f);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await frequenciaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Frequência não encontrada');
            return deletado;
        },
    };
}
