import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Classificacao } from './Classificacao.model';
import { SchemaRefCompeticao, SchemaRefTime } from '../../shared/utils/ref.schemas';

export const SchemaBaseClassificacao = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
    competicao: z.object(SchemaRefCompeticao).optional(),
    time: z.object(SchemaRefTime).optional(),
    pontos: z.coerce.number().int().nonnegative('Pontos deve ser um número inteiro não negativo'),
    jogos: z.coerce.number().int().nonnegative('Jogos deve ser um número inteiro não negativo'),
    vitorias: z.coerce.number().int().nonnegative('Vitórias deve ser um número inteiro não negativo'),
    empates: z.coerce.number().int().nonnegative('Empates deve ser um número inteiro não negativo'),
    derrotas: z.coerce.number().int().nonnegative('Derrotas deve ser um número inteiro não negativo'),
    golsPro: z.coerce.number().int().nonnegative('Gols pró deve ser um número inteiro não negativo'),
    golsContra: z.coerce.number().int().nonnegative('Gols contra deve ser um número inteiro não negativo'),
    saldoGols: z.coerce.number().int('Saldo de gols deve ser um número inteiro'),
    aproveitamento: z.coerce.number().nonnegative('Aproveitamento deve ser um número não negativo'),
});

export const SchemaCriarClassificacao = z.object({
    competicaoId: z.coerce.number().int().positive('ID da competição deve ser um número inteiro positivo'),
    timeId: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo'),
    pontos: z.coerce.number().int().nonnegative('Pontos deve ser um número inteiro não negativo').optional(),
    jogos: z.coerce.number().int().nonnegative('Jogos deve ser um número inteiro não negativo').optional(),
    vitorias: z.coerce.number().int().nonnegative('Vitórias deve ser um número inteiro não negativo').optional(),
    empates: z.coerce.number().int().nonnegative('Empates deve ser um número inteiro não negativo').optional(),
    derrotas: z.coerce.number().int().nonnegative('Derrotas deve ser um número inteiro não negativo').optional(),
    golsPro: z.coerce.number().int().nonnegative('Gols pró deve ser um número inteiro não negativo').optional(),
    golsContra: z.coerce.number().int().nonnegative('Gols contra deve ser um número inteiro não negativo').optional(),
    saldoGols: z.coerce.number().int('Saldo de gols deve ser um número inteiro').optional(),
    aproveitamento: z.coerce.number().nonnegative('Aproveitamento deve ser um número não negativo').optional(),
});

export const SchemaAtualizarClassificacao = SchemaCriarClassificacao.partial();

export const SchemaBuscarPorIdClassificacao = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
});

export const SchemaFiltrosClassificacao = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo').optional(),
    competicaoId: z.coerce.number().int().positive('ID da competição deve ser um número inteiro positivo').optional(),
    timeId: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo').optional(),
    timeNome: z.string().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Classificacao> = {};

    if (filtros.id) where.id = filtros.id;
    if (filtros.competicaoId) where.competicao = { id: filtros.competicaoId };
    if (filtros.timeId) {
        where.time = { id: filtros.timeId };
    } else if (filtros.timeNome) {
        where.time = { nome: ILike(`%${filtros.timeNome}%`) };
    }

    return where;
});

export const RELACOES_CLASSIFICACAO = ['competicao', 'time'] as const;
export const QueryIncludesClassificacao = criarIncludesSchema(RELACOES_CLASSIFICACAO);
export const SchemaClassificacoesPaginadas = SchemaRespostaPaginada(SchemaBaseClassificacao);

export type FiltrosClassificacaoDTO = z.infer<typeof SchemaFiltrosClassificacao>;
export type CriarClassificacaoDTO = z.infer<typeof SchemaCriarClassificacao>;
export type RespostaClassificacaoDTO = z.infer<typeof SchemaBaseClassificacao>;
export type AtualizarClassificacaoDTO = z.infer<typeof SchemaAtualizarClassificacao>;
