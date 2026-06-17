import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ITimeRepository } from "../time/time.interfaces";
import { IChamadaRepository, IChamadaService } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO, RespostaChamadaDTO, SchemaBaseChamada } from './chamada.schemas';
import { FindOptionsWhere, FindOptionsRelations } from "typeorm";




export function fazerChamadaService(chamadaRepo: IChamadaRepository, timeRepo: ITimeRepository): IChamadaService {
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
            const chamada = await chamadaRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (chamada?.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }
            return SchemaBaseChamada.parse(chamada);
        },

        async obterPorData(data: Date, relations?: FindOptionsRelations<Chamada>) {
            const usuario = authStorage.getStore();
            let where: FindOptionsWhere<Chamada> = { data };
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');

                where = {
                    ...where,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }

            const chamadas = await chamadaRepo.obterPorData(where, relations);
            if (!chamadas || chamadas.length === 0) return null;

            return chamadas.map(chamada => SchemaBaseChamada.parse(chamada));
        },

        async criar(data: CriarChamadaDTO): Promise<RespostaChamadaDTO> {
            const usuario = authStorage.getStore();

            // 1. Buscar o time para obter o nucleoId
            const time = await timeRepo.obterPorId(data.time.id, { nucleo: true });
            if (!time) throw new AppError(404, 'Time não encontrado');
            const nucleoId = time.nucleo.id; // time deve ter nucleoId

            // 2. Validar permissão do professor
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }
                if (nucleoId !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Você não pode criar chamada para um núcleo diferente do seu');
                }
            }
            // Se for admin, não precisa de validação (ou pode validar se quiser)

            // 3. Verificar duplicidade
            const conflitos = await chamadaRepo.buscarConflitos(data.data, data.time.id);
            if (conflitos && conflitos.length > 0) {
                throw new AppError(409, 'Já existe uma chamada para este time nesta data');
            }

            // 4. Criar a chamada COM o nucleoId obtido do time (não do cliente)
            data.nucleo = { id: nucleoId };
            const chamada = await chamadaRepo.criar(data);

            return SchemaBaseChamada.parse(chamada);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore();
            const chamada = await chamadaRepo.obterPorId(id, { nucleo: true });
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');

            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                if (chamada.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }
            const deletado = await chamadaRepo.deletar(id);
            return deletado;
        },
        async atualizar(id: number, data: Partial<CriarChamadaDTO>): Promise<RespostaChamadaDTO> {

            const usuario = authStorage.getStore();
            const chamadaExistente = await chamadaRepo.obterPorId(id, { nucleo: true });

            if (!chamadaExistente) throw new AppError(404, 'Chamada não encontrada');
            if (data.time && data.time.id !== chamadaExistente.time?.id) {
                const novoTime = await timeRepo.obterPorId(data.time.id, { nucleo: true });
                if (!novoTime) throw new AppError(404, 'Time não encontrado');
                if (usuario &&usuario.permissao !== 'admin' && novoTime.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Você não pode vincular a um time de outro núcleo');
                }
            }
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                const nucleoId = chamadaExistente.nucleo.id;
                if (!nucleoId || nucleoId !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a chamada fora do núcleo vinculado');
                }
            }

            const chamadaAtualizada = await chamadaRepo.atualizar(id, data);
            return SchemaBaseChamada.parse(chamadaAtualizada);
        },
    };
}