import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ITimeRepository, ITimeService } from "./time.interfaces";
import { Time } from "./time.model";
import { CriarTimeDTO, AtualizarTimeDTO, FiltrosTimeDTO, SchemaTimeResposta } from "./time.schemas";
import { FindOptionsRelations } from "typeorm";

export function fazerTimeService(timeRepo: ITimeRepository): ITimeService {
    return {
        async listar(pagina: number, limite: number, where?: FiltrosTimeDTO, relations?: FindOptionsRelations<Time>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await timeRepo.listar(pagina, limite, finalWhere, relations);
            return SchemaRespostaPaginada(SchemaTimeResposta).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Time>) {
            const usuario = authStorage.getStore();
            const time = await timeRepo.obterPorId(id, relations);
            if (!time) throw new AppError(404, 'Time não encontrado');
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (time.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            return SchemaTimeResposta.parse(time);
        },

        async criar(data: CriarTimeDTO) {
            const usuario = authStorage.getStore();

            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                data = {
                    ...data,
                    nucleo: { id: usuario.nucleoVinculadoId },
                };
            }

            if (!data.nucleo?.id) {
                throw new AppError(400, 'Informe o núcleo do time');
            }

            const time = await timeRepo.criar(data);
            return SchemaTimeResposta.parse(time);
        },

        async atualizar(id: number, data: AtualizarTimeDTO) {
            const usuario = authStorage.getStore();
            const timeExistente = await timeRepo.obterPorId(id, { nucleo: true });
            if (!timeExistente) throw new AppError(404, 'Time não encontrado');

            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (timeExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a time fora do núcleo vinculado');
                }
                if (data.nucleo && data.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Não é permitido mover o time para outro núcleo');
                }
            }

            const time = await timeRepo.atualizar(id, data);
            if (!time) throw new AppError(404, 'Time não encontrado');
            return SchemaTimeResposta.parse(time);
        },

        async deletar(id: number) {
            const usuario = authStorage.getStore();
            const timeExistente = await timeRepo.obterPorId(id, { nucleo: true });
            if (!timeExistente) throw new AppError(404, 'Time não encontrado');

            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (timeExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a time fora do núcleo vinculado');
                }
            }

            const deletado = await timeRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Time não encontrado');
            return deletado;
        },
    };
}
