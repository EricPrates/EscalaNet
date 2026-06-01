import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Classificacao } from './Classificacao.model';

export const SchemaBaseClassificacao = z.object({
    id: z.coerce.number().int().positive(),
    competicao: z.object({
        id: z.coerce.number().int().positive(),
        nome: z.string().optional(),
    }).optional(),
    time: z.object({
        id: z.coerce.number().int().positive(),
        nome: z.string().min(1, 'Nome do time é obrigatório'),
    }),
    pontos: z.coerce.number().int().nonnegative(),
    jogos: z.coerce.number().int().nonnegative(),
    vitorias: z.coerce.number().int().nonnegative(),
    empates: z.coerce.number().int().nonnegative(),
    derrotas: z.coerce.number().int().nonnegative(),
    golsPro: z.coerce.number().int().nonnegative(),
    golsContra: z.coerce.number().int().nonnegative(),
    saldoGols: z.coerce.number().int(),
    aproveitamento: z.coerce.number().nonnegative(),
});

export const SchemaCriarClassificacao = z.object({
    competicaoId: z.coerce.number().int().positive(),
    timeId: z.coerce.number().int().positive(),
    pontos: z.coerce.number().int().nonnegative().optional(),
    jogos: z.coerce.number().int().nonnegative().optional(),
    vitorias: z.coerce.number().int().nonnegative().optional(),
    empates: z.coerce.number().int().nonnegative().optional(),
    derrotas: z.coerce.number().int().nonnegative().optional(),
    golsPro: z.coerce.number().int().nonnegative().optional(),
    golsContra: z.coerce.number().int().nonnegative().optional(),
    saldoGols: z.coerce.number().int().optional(),
    aproveitamento: z.coerce.number().nonnegative().optional(),
});

export const SchemaAtualizarClassificacao = SchemaCriarClassificacao.partial();

export const SchemaBuscarPorIdClassificacao = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
});

export const SchemaFiltrosClassificacao = z.object({
    id: z.coerce.number().int().positive().optional(),
    competicaoId: z.coerce.number().int().positive().optional(),
    timeId: z.coerce.number().int().positive().optional(),
    timeNome: z.string().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Classificacao> = {} as any;

    if (filtros.id) where.id = filtros.id;
    if (filtros.competicaoId) where.competicao = { id: filtros.competicaoId } as any;
    if (filtros.timeId) where.time = { id: filtros.timeId } as any;
    if (filtros.timeNome) where.time = { nome: ILike(`%${filtros.timeNome}%`) } as any;

    return where;
});

export const RELACOES_CLASSIFICACAO = ['competicao', 'time'] as const;
export const QueryIncludesClassificacao = criarIncludesSchema(RELACOES_CLASSIFICACAO);
export const SchemaClassificacoesPaginadas = SchemaRespostaPaginada(SchemaBaseClassificacao);

export type FiltrosClassificacaoDTO = z.infer<typeof SchemaFiltrosClassificacao>;
export type CriarClassificacaoDTO = z.infer<typeof SchemaCriarClassificacao>;
export type RespostaClassificacaoDTO = z.infer<typeof SchemaBaseClassificacao>;
export type AtualizarClassificacaoDTO = z.infer<typeof SchemaAtualizarClassificacao>;
