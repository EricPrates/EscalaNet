import { FindOptionsRelations, FindOptionsWhere, In, Not } from "typeorm";
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { IJogoRepository, IJogoService } from "./jogo.interfaces";
import { CriarJogoDTO, RespostaJogoDTO, SchemaJogoResposta } from "./jogo.schemas";
import { Jogo } from "./Jogo.model";
import { authStorage } from "../../shared/utils/authStorage";
import { ITimeRepository } from "../time/time.interfaces";

export function fazerJogoService(jogoRepo: IJogoRepository, timeRepo: ITimeRepository): IJogoService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Jogo>, relations?: FindOptionsRelations<Jogo>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};

            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                const timeIds = await timeRepo.listarIdsPorNucleo(usuario.nucleoVinculadoId);
                if (timeIds.length === 0) throw new AppError(403, 'Nenhum time encontrado para o núcleo');
                // Aplica o filtro de núcleo, sobrescrevendo eventuais filtros de time
                finalWhere = {
                    ...finalWhere,
                    timeA: { id: In(timeIds) },
                    timeB: { id: In(timeIds) }
                };
            }

            const { data, total } = await jogoRepo.listar(pagina, limite, finalWhere, relations);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogoResposta).parse({
                data,
                meta: { pagina, limite, total, totalPaginas }
            });
        },

        async contar(where?: FindOptionsWhere<Jogo>): Promise<number> {
            return await jogoRepo.contar(where);
        },


        async obterPorId(id: number, relations?: FindOptionsRelations<Jogo>): Promise<RespostaJogoDTO> {
            const jogo = await jogoRepo.obterPorId(id, relations);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return SchemaJogoResposta.parse(jogo);
        },

        async criar(data: CriarJogoDTO): Promise<RespostaJogoDTO> {
            const usuario = authStorage.getStore();

            // 1. Validar times diferentes
            if (data.timeA.id === data.timeB.id) {
                throw new AppError(400, 'Time A e Time B não podem ser o mesmo time');
            }

            // 2. Buscar times com núcleo (para validar permissão)
            const timeA = await timeRepo.obterPorId(data.timeA.id, { nucleo: true });
            if (!timeA) throw new AppError(404, 'Time A não encontrado');

            const timeB = await timeRepo.obterPorId(data.timeB.id, { nucleo: true });
            if (!timeB) throw new AppError(404, 'Time B não encontrado');

            // 3. Se for professor, validar núcleo (um dos times devem pertencer ao núcleo)
            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }
                if (timeA.nucleo?.id !== usuario.nucleoVinculadoId && timeB.nucleo?.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: Um dos times não pertence ao núcleo vinculado do professor');
                }
            }

            // 5. Verificar duplicidade (mesmo timeA, timeB, data)
            const existente = await jogoRepo.contar({
                timeA: { id: data.timeA.id },
                timeB: { id: data.timeB.id },
                data: data.data
            });
            if (existente > 0) {
                throw new AppError(409, 'Já existe um jogo com estes times nesta data');
            }

            // 6. Criar o jogo
            const jogo = await jogoRepo.criar(data);
            return SchemaJogoResposta.parse(jogo);
        },

        async atualizar(id: number, data: Partial<CriarJogoDTO>,): Promise<RespostaJogoDTO> {
            const usuario = authStorage.getStore();

            if (data.timeA?.id && data.timeB?.id) {
                // 1. Validar times diferentes
                if (data.timeA.id === data.timeB.id) {
                    throw new AppError(400, 'Time A e Time B não podem ser o mesmo time');
                }

                // 2. Buscar times com núcleo (para validar permissão)
                const timeA = await timeRepo.obterPorId(data.timeA?.id, { nucleo: true });
                if (!timeA) throw new AppError(404, 'Time A não encontrado');

                const timeB = await timeRepo.obterPorId(data.timeB?.id, { nucleo: true });
                if (!timeB) throw new AppError(404, 'Time B não encontrado');

                // 3. Se for professor, validar núcleo (um dos times devem pertencer ao núcleo)
                if (usuario?.permissao === 'professor') {
                    if (!usuario.nucleoVinculadoId) {
                        throw new AppError(403, 'Professor sem núcleo vinculado');
                    }
                    if (timeA.nucleo?.id !== usuario.nucleoVinculadoId && timeB.nucleo?.id !== usuario.nucleoVinculadoId) {
                        throw new AppError(403, 'Acesso negado: Um dos times não pertence ao núcleo vinculado do professor');
                    }
                }

                // 5. Verificar duplicidade (mesmo timeA, timeB, data)
                const existente = await jogoRepo.contar({
                    timeA: { id: data.timeA.id },
                    timeB: { id: data.timeB.id },
                    data: data.data,
                    id: Not(id) // ← exclui o próprio jogo
                });
                if (existente > 0) {
                    throw new AppError(409, 'Já existe um jogo com estes times nesta data');
                }
            }
            const jogo = await jogoRepo.atualizar(id, data);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return SchemaJogoResposta.parse(jogo);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore();
            const jogo = await jogoRepo.obterPorId(id, {
                timeA: { nucleo: true },
                timeB: { nucleo: true }
            });
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');

            // 3. Se for professor, validar núcleo (um dos times devem pertencer ao núcleo)
            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }
                if (jogo.timeA?.nucleo?.id !== usuario.nucleoVinculadoId && jogo.timeB?.nucleo?.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: Um dos times não pertence ao núcleo vinculado do professor');
                }
            }
            const deletado = await jogoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Jogo não encontrado');
            return deletado;
        },
    };
}
