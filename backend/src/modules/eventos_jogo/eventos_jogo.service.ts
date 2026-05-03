
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IEventoJogoRepository, IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO, SchemaEventoJogoRespostaDetalhada } from "./eventos_jogo.schemas";
import { includesPermitidos } from "../jogador/helpers/filtrosErelacoes";
import { fazerJogadorFiltrosERelacoes } from "../jogador/helpers/filtrosErelacoes";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";



export function fazerEventoJogoService(eventoRepo: IEventoJogoRepository): IEventoJogoService {
    return {
        async listar(pagina: number, limite: number, filtros?: any, includes?: string[], ) {
            if (includes && includes.some((include) => !includesPermitidos.includes(include))) {
                throw new AppError(400, 'Includes inválidos');
            }
            const { where, relations, select } = fazerJogadorFiltrosERelacoes(filtros, includes)
            const { data, total } = await eventoRepo.listar(pagina, limite, where, relations, select);
            return SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },
        async obterPorId(id: number): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.obterPorId(id);
            if (!e) throw new AppError(404, 'Evento não encontrado');
            return SchemaEventoJogoRespostaDetalhada.parse((e));
        },

        async criar(data: CriarEventoJogoDTO): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.criar(data);
            return SchemaEventoJogoRespostaDetalhada.parse(e);
        },

        async atualizar(id: number, data: Partial<CriarEventoJogoDTO>): Promise<RespostaEventoJogoDTO> {
            const e = await eventoRepo.atualizar(id, data);
            if (!e) throw new AppError(404, 'Evento não encontrado');
            return SchemaEventoJogoRespostaDetalhada.parse(e);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await eventoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Evento não encontrado');
            return deletado;
        },
    };
}
