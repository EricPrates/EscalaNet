import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IEventoJogoRepository, IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO, SchemaEventoJogoResposta } from "./eventos_jogo.schemas";

function mapearEvento(e: any): RespostaEventoJogoDTO {
    return SchemaEventoJogoResposta.parse({
        id: e.id,
        tipo: e.tipo,
        descricao: e.descricao ?? null,
        minuto: e.minuto,
        jogo: e.jogo ? { id: e.jogo.id, nome: e.jogo.nome, data: e.jogo.data } : undefined,
        usuario: e.usuario ? { id: e.usuario.id, nome: e.usuario.nome } : undefined,
        nucleo: e.nucleo ? { id: e.nucleo.id, nome: e.nucleo.nome } : undefined,
        alunoEnvolvido: e.alunoEnvolvido ? { id: e.alunoEnvolvido.id, nome: e.alunoEnvolvido.nome } : null,
    });
}

export function fazerEventoJogoService(eventoRepo: IEventoJogoRepository): IEventoJogoService {
    return {
        async listar(pagina: number, limite: number) {
            const { data, total } = await eventoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaEventoJogoResposta).parse({
                data: data.map(mapearEvento),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async listarPorJogo(pagina: number, limite: number, jogoId: number) {
            const { data, total } = await eventoRepo.listarPorJogo(pagina, limite, jogoId);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaEventoJogoResposta).parse({
                data: data.map(mapearEvento),
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.obterPorId(id);
            if (!e) throw new AppError(404, 'Evento não encontrado');
            return mapearEvento(e);
        },

        async criar(data: CriarEventoJogoDTO): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.criar(data);
            return mapearEvento(e);
        },

        async atualizar(id: number, data: Partial<CriarEventoJogoDTO>): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.atualizar(id, data);
            if (!e) throw new AppError(404, 'Evento não encontrado');
            return mapearEvento(e);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await eventoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Evento não encontrado');
            return deletado;
        },
    };
}
