import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ICompeticaoRepository, ICompeticaoService } from "./competicao.interfaces";
import { Competicao } from "./Competicao.model";
import { CriarCompeticaoDTO, RespostaCompeticaoDTO, SchemaBaseCompeticao, AtualizarCompeticaoDTO, FiltrosCompeticaoDTO } from "./competicao.schemas";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";

export function fazerCompeticaoService(competicaoRepo: ICompeticaoRepository): ICompeticaoService {
    return {
        async listar(pagina: number, limite: number, where?: FiltrosCompeticaoDTO, relations?: FindOptionsRelations<Competicao>): Promise<{ data: RespostaCompeticaoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await competicaoRepo.listar(pagina, limite, where as FindOptionsWhere<Competicao> | undefined, relations);
            return SchemaRespostaPaginada(SchemaBaseCompeticao).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Competicao>): Promise<RespostaCompeticaoDTO> {
            const competicao = await competicaoRepo.obterPorId(id, relations);
            if (!competicao) throw new AppError(404, 'Competição não encontrada');
            return SchemaBaseCompeticao.parse(competicao);
        },

        async criar(data: CriarCompeticaoDTO): Promise<RespostaCompeticaoDTO> {
            const competicao = await competicaoRepo.criar(data);
            return SchemaBaseCompeticao.parse(competicao);
        },

        async atualizar(id: number, data: AtualizarCompeticaoDTO): Promise<RespostaCompeticaoDTO> {
            const competicao = await competicaoRepo.atualizar(id, data);
            if (!competicao) throw new AppError(404, 'Competição não encontrada');
            return SchemaBaseCompeticao.parse(competicao);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await competicaoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Competição não encontrada');
            return deletado;
        },
    };
}