import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefJogo, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';

import { FindOptionsWhere } from 'typeorm';
import { EventosJogo } from './EventosJogo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { ILike } from "typeorm";


export const SchemaBaseEventoJogo = z.object({
    tipo: z.enum(["gol", "falta", "cartao_amarelo", "cartao_vermelho", "escanteio", "substituicao"]),
    descricao: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').nullable().optional(),
    minuto: z.number().int().nonnegative('Minuto deve ser um número inteiro não negativo'),
    jogo: SchemaRefJogo.optional(),
    usuario: SchemaRefUsuario.optional(),
    nucleo: SchemaRefNucleo.optional(),
    jogadorEnvolvido: SchemaRefJogador.nullable().optional(),
});

export const SchemaEventoJogoRespostaDetalhada = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
    tipo: z.enum(["gol", "falta", "cartao_amarelo", "cartao_vermelho", "escanteio", "substituicao"]),
    descricao: z.string().max(1000).nullable(),
    minuto: z.number().int().nonnegative(),
    jogo: SchemaRefJogo.optional(),
    usuario: SchemaRefUsuario.optional(),
    nucleo: SchemaRefNucleo.optional(),
    jogadorEnvolvido: SchemaRefJogador.nullable().optional(),
});
export const SchemaFiltroEventoJogo = z.object({
    tipo: z.enum(["gol", "falta", "cartao_amarelo", "cartao_vermelho", "escanteio", "substituicao"]).optional(),
    minuto: z.coerce.number().int().nonnegative().optional(),
    jogoId: z.coerce.number().int().positive().optional(),
    usuarioId: z.coerce.number().int().positive().optional(),
    nucleoId: z.coerce.number().int().positive().optional(),
    jogadorEnvolvidoId: z.coerce.number().int().positive().optional(),
    descricao: z.string().optional(),
    acrescimo: z.coerce.number().int().nonnegative().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<EventosJogo> = {};

    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.minuto !== undefined) where.minuto = filtros.minuto;
    if (filtros.jogoId) where.jogo = { id: filtros.jogoId };
    if (filtros.usuarioId) where.usuario = { id: filtros.usuarioId };
    if (filtros.jogadorEnvolvidoId) where.jogadorEnvolvido = { id: filtros.jogadorEnvolvidoId };
    if (filtros.descricao) where.descricao = ILike(`%${filtros.descricao}%`);
    if (filtros.minuto !== undefined) where.minuto = filtros.minuto;
    if (filtros.acrescimo !== undefined) where.acrescimo = filtros.acrescimo;
    return where;
});

export const RELACOES_EVENTOS_JOGO = [ 'time', 'jogo', 'treino', 'jogadorEnvolvido', 'usuario' ] as const;
export const QueryIncludesEventosJogo = criarIncludesSchema(RELACOES_EVENTOS_JOGO);

export const SchemaAtualizarEventoJogo = SchemaBaseEventoJogo.partial();
export const SchemaEventosJogoPaginados = SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada);
export type FiltrosEventoJogoDTO = z.infer<typeof SchemaFiltroEventoJogo>;
export type CriarEventoJogoDTO = z.infer<typeof SchemaBaseEventoJogo>;
export type RespostaEventoJogoDTO = z.infer<typeof SchemaEventoJogoRespostaDetalhada>;
export type AtualizarEventoJogoDTO = z.infer<typeof SchemaAtualizarEventoJogo>;
