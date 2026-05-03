import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IFrequenciaRepository, IFrequenciaService } from "./frequencia.interfaces";
import { CriarFrequenciaDTO, RespostaFrequenciaDTO, SchemaFrequenciaResposta } from './frequencia.schemas';


export function fazerFrequenciaService(frequenciaRepo: IFrequenciaRepository): IFrequenciaService {
    return {
        async listar(pagina: number, limite: number) {
            const { data, total } = await frequenciaRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaFrequenciaResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },


        async obterPorId(id: number): Promise<RespostaFrequenciaDTO> {
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
