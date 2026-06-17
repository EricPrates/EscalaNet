import { FindOptionsRelations } from "typeorm";
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IFrequenciaRepository, IFrequenciaService } from "./frequencia.interfaces";
import { CriarFrequenciaDTO, FiltrosFrequenciaDTO, RespostaFrequenciaDTO, SchemaFrequenciaResposta } from './frequencia.schemas';
import { authStorage } from "../../shared/utils/authStorage";
import { Frequencia } from "./frequencia.model";
import { IJogadorRepository } from "../jogador/jogador.interfaces";
import { IChamadaRepository } from "../chamada/chamada.interfaces";




export function fazerFrequenciaService(frequenciaRepo: IFrequenciaRepository, jogadorRepo: IJogadorRepository, chamadaRepo: IChamadaRepository): IFrequenciaService {
    return {
        async listar(pagina: number, limite: number, where: FiltrosFrequenciaDTO, relations?: FindOptionsRelations<RespostaFrequenciaDTO>) {
            const usuario = authStorage.getStore();


            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await frequenciaRepo.listar(pagina, limite, finalWhere, relations)
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async listarPorJogador(pagina: number, limite: number, jogadorId: number) {
            const { data, total } = await frequenciaRepo.listarPorJogador(pagina, limite, jogadorId);
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Frequencia>): Promise<RespostaFrequenciaDTO> {
            const frequencia = await frequenciaRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!frequencia) throw new AppError(404, 'Frequência não encontrada');
            const usuario = authStorage.getStore();
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (frequencia.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }

            return SchemaFrequenciaResposta.parse(frequencia);
        },

        async criar(data: CriarFrequenciaDTO): Promise<RespostaFrequenciaDTO> {
            const usuario = authStorage.getStore();
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                data.nucleoId = usuario.nucleoVinculadoId;
            } else if (!data.nucleoId) {
                throw new AppError(400, 'Núcleo é obrigatório');
            }
           const jogador = await jogadorRepo.obterPorId(data.jogadorId, { nucleo: true });
            if (!jogador || jogador.nucleo.id !== usuario!.nucleoVinculadoId) {
                throw new AppError(403, 'Jogador não pertence ao seu núcleo');
            }
            // Verificar se a chamada pertence ao núcleo
            const chamada = await chamadaRepo.obterPorId(data.chamadaId, { nucleo: true });
            if (!chamada || chamada.nucleo.id !== usuario!.nucleoVinculadoId) {
                throw new AppError(403, 'Chamada não pertence ao seu núcleo');
            }
            const frequencia = await frequenciaRepo.criar(data);
            return SchemaFrequenciaResposta.parse(frequencia);
        },

        async atualizar(id: number, data: Partial<CriarFrequenciaDTO>): Promise<RespostaFrequenciaDTO> {
            const frequencia = await frequenciaRepo.atualizar(id, data);
            if (!frequencia) throw new AppError(404, 'Frequência não encontrada');
            return SchemaFrequenciaResposta.parse(frequencia);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await frequenciaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Frequência não encontrada');
            return deletado;
        },
    };
}
