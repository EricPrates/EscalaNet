
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IChamadaRepository, IChamadaService } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO, RespostaChamadaDTO, SchemaBaseChamada, AtualizarChamadaDTO } from './chamada.schemas';
import { FindOptionsWhere, FindOptionsRelations } from "typeorm";

export function fazerChamadaService(chamadaRepo: IChamadaRepository): IChamadaService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<{ data: RespostaChamadaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await chamadaRepo.listar(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaBaseChamada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Chamada>): Promise<RespostaChamadaDTO> {
            const chamada = await chamadaRepo.obterPorId(id, relations);
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamada);
        },
        async obterPorFiltros(pagina: number, limite: number, filtro: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<{ data: RespostaChamadaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await chamadaRepo.obterPorFiltros(pagina, limite, filtro, relations);
            return SchemaRespostaPaginada(SchemaBaseChamada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorData(data: Date, relations?: FindOptionsRelations<Chamada>): Promise<RespostaChamadaDTO[] | null> {
            const chamada = await chamadaRepo.obterPorData(data, relations);
            return chamada ? chamada.map(chamada => SchemaBaseChamada.parse(chamada)) : null;
        },

        async criar(data: CriarChamadaDTO): Promise<RespostaChamadaDTO> {
            const existentes = await this.obterPorData(data.data); 

            if (existentes && existentes.length > 0) {
                for (const chamada of existentes) {
                    const conflitoJogo = chamada.jogoId === data.jogoId && chamada.timeId === data.timeId && chamada.data.getTime() === data.data.getTime();
                    const conflitoTreinoTime = chamada.treinoId === data.treinoId &&
                        chamada.timeId === data.timeId && chamada.data.getTime() === data.data.getTime();

                    if (conflitoJogo || conflitoTreinoTime) {
                        throw new AppError(409, 'Chamada duplicada');
                    }
                }
            }

            const chamada = await chamadaRepo.criar(data);
            return SchemaBaseChamada.parse(chamada);
        },

        async atualizar(id: number, data: AtualizarChamadaDTO): Promise<RespostaChamadaDTO> {
            const chamada = await chamadaRepo.atualizar(id, data);
            if (!chamada || chamada === null) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamada);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await chamadaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Chamada não encontrada');
            return deletado;
        },
    };
}
