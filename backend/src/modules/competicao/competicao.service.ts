import { DataSource } from "typeorm";
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ICompeticaoRepository, ICompeticaoService } from "./competicao.interfaces";
import { Competicao } from "./Competicao.model";
import { CriarCompeticaoDTO, RespostaCompeticaoDTO, SchemaBaseCompeticao, AtualizarCompeticaoDTO, FiltrosCompeticaoDTO } from "./competicao.schemas";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { gerarJogosCompeticao, recalcularClassificacao as recalcularClassificacaoMotor } from "./motor.competicao";
import { SchemaJogoResposta } from "../jogo/jogo.schemas";

export function fazerCompeticaoService(competicaoRepo: ICompeticaoRepository, dataSource: DataSource): ICompeticaoService {
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

        async obterPorFiltros(pagina: number, limite: number, where: FiltrosCompeticaoDTO, relations?: FindOptionsRelations<Competicao>): Promise<{ data: RespostaCompeticaoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await competicaoRepo.obterPorFiltros(pagina, limite, where as FindOptionsWhere<Competicao>, relations);
            return SchemaRespostaPaginada(SchemaBaseCompeticao).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async gerarJogos(id: number, dataInicio: Date) {
            const competicao = await competicaoRepo.obterPorId(id);
            if (!competicao) throw new AppError(404, 'Competição não encontrada');

            const jogos = await gerarJogosCompeticao(id, dataInicio, dataSource );
            return jogos.map(jogo => SchemaJogoResposta.parse(jogo));
        },

        async vincularTimes(id: number, timeIds: number[]) {
            const competicao = await competicaoRepo.vincularTimes(id, timeIds);
            if (!competicao) throw new AppError(404, 'Competição não encontrada');
            return SchemaBaseCompeticao.parse(competicao);
        },

        async recalcularClassificacao(id: number) {
            const competicao = await competicaoRepo.obterPorId(id);
            if (!competicao) throw new AppError(404, 'Competição não encontrada');
            if (competicao.tipo !== 'Liga') {
                throw new AppError(400, 'Cálculo de tabela só é aplicável a competições do tipo Liga');
            }

            await recalcularClassificacaoMotor(id, dataSource);
            return SchemaBaseCompeticao.parse(competicao);
        },
    };
}
