
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IEventoJogoRepository, IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO, RespostaEventoJogoDTO, SchemaEventoJogoRespostaDetalhada, FiltrosEventoJogoDTO } from './eventos_jogo.schemas';
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { FindOptionsRelations } from "typeorm";
import { authStorage } from "../../shared/utils/authStorage";
import { EventosJogo } from "./EventosJogo.model";
import { IJogoRepository } from "../jogo/jogo.interfaces";




export function fazerEventoJogoService(eventoRepo: IEventoJogoRepository, jogoRepo: IJogoRepository): IEventoJogoService {
    return {

        async listar(pagina: number, limite: number, where: FiltrosEventoJogoDTO, relations?: FindOptionsRelations<EventosJogo>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario && usuario.permissao !== "admin") {
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

        async obterPorId(id: number, relations?: FindOptionsRelations<EventosJogo>): Promise<RespostaEventoJogoDTO> {
            const usuario = authStorage.getStore();
            const evento = await eventoRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!evento) throw new AppError(404, 'Evento não encontrado');

            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (evento.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado aos eventos fora do núcleo vinculado');
                }
            }

            return SchemaEventoJogoRespostaDetalhada.parse(evento);
        },

        async criar(data: CriarEventoJogoDTO): Promise<RespostaEventoJogoDTO> {
            const usuario = authStorage.getStore();
            if (usuario && usuario.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                data.nucleo = { id: usuario.nucleoVinculadoId };
            } else if (!data.nucleo?.id) {
                throw new AppError(400, 'Núcleo é obrigatório');
            }
            const evento = await eventoRepo.criar(data);
            if (!evento) throw new AppError(500, 'Erro ao criar evento');
            return SchemaEventoJogoRespostaDetalhada.parse(evento);
        },

        async atualizar(id: number, data: Partial<CriarEventoJogoDTO>): Promise<RespostaEventoJogoDTO> {
            const usuario = authStorage.getStore()!;
            const eventoExistente = await eventoRepo.obterPorId(id, { nucleo: true });
            if (!eventoExistente) throw new AppError(404, 'Evento não encontrado');
            if (usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (eventoExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a evento fora do núcleo vinculado');
                }
            }
            if (data.jogo && data.jogo.id !== eventoExistente.jogo.id) {
                const novoJogo = await jogoRepo.obterPorId(data.jogo.id);
                if (!novoJogo) throw new AppError(404, 'Jogo não encontrado');
            }
            const evento = await eventoRepo.atualizar(id, data);
            if (!evento) throw new AppError(404, 'Evento não encontrado');
            return SchemaEventoJogoRespostaDetalhada.parse(evento);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore()!;
            const eventoExistente = await eventoRepo.obterPorId(id, { nucleo: true });
            if (!eventoExistente) throw new AppError(404, 'Evento não encontrado');
            if (usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Usuário sem núcleo');
                if (eventoExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado ao usuário que não registrou o evento');
                }
            }
            const deletado = await eventoRepo.deletar(id);
            return deletado;
        },
    };
}
