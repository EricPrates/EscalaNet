
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IChamadaRepository, IChamadaService } from "./chamada.interfaces";
import { Chamada } from "./chamada.model";
import { CriarChamadaDTO, RespostaChamadaDTO, SchemaBaseChamada, AtualizarChamadaDTO } from './chamada.schemas';
import { FindOptionsWhere, FindOptionsRelations } from "typeorm";

export function fazerChamadaService(chamadaRepo: IChamadaRepository): IChamadaService {
    return {
        async listar( pagina: number, limite: number, where?: FindOptionsWhere<Chamada>, relations?: FindOptionsRelations<Chamada>): Promise<{ data: RespostaChamadaDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await chamadaRepo.listar(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaBaseChamada).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number): Promise<RespostaChamadaDTO> {
            const chamada = await chamadaRepo.obterPorId(id);
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamada);
        },

        async obterPorData(filtro: FindOptionsWhere<Chamada>): Promise<RespostaChamadaDTO> {
            const chamada = await chamadaRepo.obterPorData(filtro);
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamada);
        },

        async criar(data: CriarChamadaDTO): Promise<RespostaChamadaDTO> {
            const existente = await chamadaRepo.obterPorData({ data: data.data });
            if (existente) throw new AppError(409, 'Chamada já cadastrada');
            const chamada = await chamadaRepo.criar(data);
            return SchemaBaseChamada.parse(chamada);
        },

        async atualizar(id: number, data: AtualizarChamadaDTO): Promise<RespostaChamadaDTO> {
            const chamada = await chamadaRepo.atualizar(id, data);
            if (!chamada) throw new AppError(404, 'Chamada não encontrada');
            return SchemaBaseChamada.parse(chamada);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await chamadaRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Chamada não encontrada');
            return deletado;
        },
    };
}
