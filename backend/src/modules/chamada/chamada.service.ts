import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IChamadaRepository, IChamadaService } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO, RespostaChamadaDTO, SchemaBaseChamada, AtualizarChamadaDTO } from './chamada.schemas';
import { FindOptionsWhere, FindOptionsRelations } from "typeorm";
import { ITimeService } from "../time/time.interfaces";

export function fazerChamadaService(chamadaRepo: IChamadaRepository, timeService: ITimeService): IChamadaService {
    return {
        async listar(
            pagina: number,
            limite: number,
            where?: FindOptionsWhere<Chamada>,
            relations?: FindOptionsRelations<Chamada>
        ) {
            const usuario = authStorage.getStore();


            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }

            const { data, total } = await chamadaRepo.listar(pagina, limite, finalWhere, relations);
            return SchemaRespostaPaginada(SchemaBaseChamada).parse({
                data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Chamada>) {
            const usuario = authStorage.getStore();
            if(usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if(id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }
            const chamada = await chamadaRepo.obterPorId(id, relations);
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');

            return SchemaBaseChamada.parse(chamada);
        },

        async obterPorData(data: Date, relations?: FindOptionsRelations<Chamada>) {
            const usuario = authStorage.getStore();
            let where: FindOptionsWhere<Chamada> = { data };
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');

                where = {
                    ...where,
                    time: { nucleo: { id: usuario.nucleoVinculadoId } }
                };
            }

            const chamadas = await chamadaRepo.obterPorData(where, relations);
            if (!chamadas || chamadas.length === 0) return null;

            return chamadas.map(chamada => SchemaBaseChamada.parse(chamada));
        },

        async criar(data: CriarChamadaDTO): Promise<RespostaChamadaDTO> {
            const usuario = authStorage.getStore();


            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }

                const time = await timeService.obterPorId(data.timeId);
                if (!time || time.nucleoId !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Você não pode criar chamada para um time fora do seu núcleo');
                }
            }

            // 2. Verifica duplicidade (conflitos)
            // Podemos buscar chamadas na mesma data com mesmo time/jogo/treino
            const conflitos = await chamadaRepo.buscarConflitos(
                data.data,
                data.timeId,
            );
            if (conflitos && conflitos.length > 0) {
                throw new AppError(409, 'Já existe uma chamada para este time/jogo/treino nesta data');
            }

            const chamada = await chamadaRepo.criar(data);
            return SchemaBaseChamada.parse(chamada);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore();
            const chamada = await chamadaRepo.obterPorId(id, { time: { nucleo: true } });
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');

            if (usuario?.permissao === "professor") {
                const nucleoId = chamada.time?.nucleo?.id;
                if (!nucleoId || nucleoId !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }

            const deletado = await chamadaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Chamada não encontrada');
            return deletado;
        },
        async atualizar(id: number, data: AtualizarChamadaDTO): Promise<RespostaChamadaDTO> {
            const usuario = authStorage.getStore();
            const chamadaExistente = await chamadaRepo.obterPorId(id, { time: { nucleo: true } });
            if (!chamadaExistente) throw new AppError(404, 'Chamada não encontrada');

            if (usuario?.permissao === "professor") {
                const nucleoId = chamadaExistente.time?.nucleo?.id;
                if (!nucleoId || nucleoId !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }

            const chamadaAtualizada = await chamadaRepo.atualizar(id, data);
            if (!chamadaAtualizada) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamadaAtualizada);
        },
    };
}