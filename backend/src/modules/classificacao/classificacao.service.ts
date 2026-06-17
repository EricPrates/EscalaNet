import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { IClassificacaoRepository, IClassificacaoService } from "./classificacao.interfaces";
import { Classificacao } from "./Classificacao.model";
import { AtualizarClassificacaoDTO, CriarClassificacaoDTO, RespostaClassificacaoDTO, SchemaBaseClassificacao } from "./classificacao.schemas";
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

export function fazerClassificacaoService(classificacaoRepo: IClassificacaoRepository): IClassificacaoService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Classificacao>, relations?: FindOptionsRelations<Classificacao>): Promise<{ data: RespostaClassificacaoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const { data, total } = await classificacaoRepo.listar(pagina, limite, where, relations);
            return SchemaRespostaPaginada(SchemaBaseClassificacao).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Classificacao>): Promise<RespostaClassificacaoDTO> {
            const classificacao = await classificacaoRepo.obterPorId(id, relations);
            if (!classificacao) throw new AppError(404, 'Classificação não encontrada');
            return SchemaBaseClassificacao.parse(classificacao);
        },

        async criar(data: CriarClassificacaoDTO): Promise<RespostaClassificacaoDTO> {
            // Verifica se já existe classificação para esta competição e time
            const existente = await classificacaoRepo.buscarPorCompeticaoETime(data.competicaoId, data.timeId);
            if (existente) throw new AppError(409, 'Classificação já existe para este time nesta competição');

            const classificacao = await classificacaoRepo.criar(data);
            return SchemaBaseClassificacao.parse(classificacao);
        },
       /* async calcularClassificacao(competicaoId: number): Promise<RespostaClassificacaoDTO[]> {
            // Você pode chamar a função existente do módulo de competição
            // ou implementar a lógica aqui.
            // Exemplo: chamar uma função importada de competição
           
        },*/

        async atualizar(id: number, data: AtualizarClassificacaoDTO): Promise<RespostaClassificacaoDTO> {
            const classificacao = await classificacaoRepo.atualizar(id, data);
            if (!classificacao) throw new AppError(404, 'Classificação não encontrada');
            return SchemaBaseClassificacao.parse(classificacao);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await classificacaoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Classificação não encontrada');
            return deletado;
        },


    };
}