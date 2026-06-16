import { FindOptionsRelations } from "typeorm";
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IFrequenciaRepository, IFrequenciaService } from "./frequencia.interfaces";
import { CriarFrequenciaDTO, FiltrosFrequenciaDTO, RespostaFrequenciaDTO, SchemaFrequenciaResposta } from './frequencia.schemas';
import { authStorage } from "../../shared/utils/authStorage";



export function fazerFrequenciaService(frequenciaRepo: IFrequenciaRepository): IFrequenciaService {
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
            const { data, total } = await frequenciaRepo.listar(pagina, limite, where, relations);
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

        async obterPorId(id: number): Promise<RespostaFrequenciaDTO> {
            const usuario = authStorage.getStore();
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            const frequencia = await frequenciaRepo.obterPorId(id);
            if (!frequencia) throw new AppError(404, 'Frequência não encontrada');
            return SchemaFrequenciaResposta.parse(frequencia);
        },

        async criar(data: CriarFrequenciaDTO): Promise<RespostaFrequenciaDTO> {
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
