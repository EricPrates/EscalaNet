
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IEventoJogoRepository, IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO, SchemaEventoJogoRespostaDetalhada, FiltrosEventoJogoDTO } from './eventos_jogo.schemas';
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { FindOptionsRelations } from "typeorm";
import { authStorage } from "../../shared/utils/authStorage";




export function fazerEventoJogoService(eventoRepo: IEventoJogoRepository): IEventoJogoService {
    return {

        async listar(pagina: number, limite: number, where: FiltrosEventoJogoDTO, relations?: FindOptionsRelations<any>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await eventoRepo.listar(pagina, limite, finalWhere, relations);
            return SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada).parse({
                data,
                meta: montarPaginacao(pagina, limite, total),
            });

        },

        async obterPorId(id: number, relations?: FindOptionsRelations<RespostaEventoJogoDTO>): Promise<RespostaEventoJogoDTO> {
            const usuario = authStorage.getStore();
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado aos eventos fora do núcleo vinculado');
                }
            }
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
