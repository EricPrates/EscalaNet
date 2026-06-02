
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IEventoJogoRepository, IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO, SchemaEventoJogoRespostaDetalhada, FiltrosEventoJogoDTO } from './eventos_jogo.schemas';
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { FindOptionsRelations } from "typeorm";




export function fazerEventoJogoService(eventoRepo: IEventoJogoRepository): IEventoJogoService {
    return {

        async listar(pagina: number, limite: number, where: FiltrosEventoJogoDTO, relations?: FindOptionsRelations<any>) {
            const { data, total } = await eventoRepo.listar(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },
        async obterPorFiltros(pagina: number, limite: number, where: FiltrosEventoJogoDTO, relations?: FindOptionsRelations<any>) {
            const { data, total } = await eventoRepo.obterPorFiltros(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },
        async obterPorId(id: number, relations?: FindOptionsRelations<RespostaEventoJogoDTO>): Promise<RespostaEventoJogoDTO> {
            const evento = await eventoRepo.obterPorId(id, relations);
            if (!evento) throw new AppError(404, 'Evento não encontrado');
            return SchemaEventoJogoRespostaDetalhada.parse(evento);
        },

        async criar(data: CriarEventoJogoDTO): Promise<RespostaEventoJogoDTO> {
            const eve = await eventoRepo.criar(data);
            return SchemaEventoJogoRespostaDetalhada.parse(eve);
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
