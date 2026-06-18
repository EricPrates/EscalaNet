import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefJogo, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';
import { TipoEvento } from './TipoEvento';
import { FindOptionsWhere, ILike } from 'typeorm';
import { EventosJogo } from './EventosJogo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';

export const TIPO_EVENTO = TipoEvento;
export type TipoEventoType = typeof TipoEvento[number];

export const SchemaBaseEventoJogo = z.object({
    tipo: z.enum(TipoEvento, {
        error: 'Tipo de evento inválido. Use: gol, falta, cartao_amarelo, cartao_vermelho, escanteio ou substituicao',
    }),
    descricao: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').nullable().optional(),
    minuto: z.number().int().nonnegative('Minuto deve ser um número inteiro não negativo'),
    jogoId: z.number().int().positive('ID do jogo deve ser um número inteiro positivo'),
    usuarioId: z.number().int().positive('ID do usuário deve ser um número inteiro positivo'),
    nucleoId: z.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    jogadorEnvolvidoId: z.number().int().positive('ID do jogador deve ser um número inteiro positivo').nullable().optional(),
    acrescimo: z.number().int().nonnegative().nullable().optional(),
}).transform(({ jogoId, usuarioId, nucleoId, jogadorEnvolvidoId, ...resto }) => ({
    ...resto,
    jogo: { id: jogoId },
    usuario: { id: usuarioId },
    nucleo: { id: nucleoId },
    jogadorEnvolvido: jogadorEnvolvidoId ? { id: jogadorEnvolvidoId } : undefined,
}));

export const SchemaBuscarPorIdEventoJogo = z.object({
    id: z.coerce.number().int().positive("ID do evento deve ser um número inteiro positivo"),
});

export const SchemaEventoJogoRespostaDetalhada = z.object({
    id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
    tipo: z.enum(TipoEvento),
    descricao: z.string().max(1000).nullable(),
    minuto: z.number().int().nonnegative(),
    jogo: SchemaRefJogo.optional(),
    usuario: SchemaRefUsuario.optional(),
    nucleo: SchemaRefNucleo.optional(),
    jogadorEnvolvido: SchemaRefJogador.nullable().optional(),
});

export const SchemaFiltroEventoJogo = z.object({
    tipo: z.enum(TipoEvento).optional(),
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
    if (filtros.acrescimo !== undefined) where.acrescimo = filtros.acrescimo;
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    return where;
});

export const RELACOES_EVENTOS_JOGO = ['nucleo', 'jogo', 'jogadorEnvolvido', 'usuario', 'time', ] as const;
export const QueryIncludesEventosJogo = criarIncludesSchema(RELACOES_EVENTOS_JOGO);

export const SchemaAtualizarEventoJogo  = z.object({
    tipo: z.enum(TipoEvento, {
        error: 'Tipo de evento inválido. Use: gol, falta, cartao_amarelo, cartao_vermelho, escanteio ou substituicao',
    }).optional(),
    descricao: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').nullable().optional(),
    minuto: z.number().int().nonnegative('Minuto deve ser um número inteiro não negativo').optional(),
    jogoId: z.number().int().positive('ID do jogo deve ser um número inteiro positivo').optional(),
    usuarioId: z.number().int().positive('ID do usuário deve ser um número inteiro positivo').optional(),
    nucleoId: z.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    jogadorEnvolvidoId: z.number().int().positive('ID do jogador deve ser um número inteiro positivo').nullable().optional(),
}).transform(({ jogoId, usuarioId, nucleoId, jogadorEnvolvidoId, ...resto }) => ({
    ...resto,
     jogo: jogoId ? { id: jogoId } : undefined,
    usuario: usuarioId ? { id: usuarioId } : undefined,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
    jogadorEnvolvido: jogadorEnvolvidoId ? { id: jogadorEnvolvidoId } : undefined
}));
export const SchemaEventosJogoPaginados = SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada);

export type FiltrosEventoJogoDTO = z.infer<typeof SchemaFiltroEventoJogo>;
export type CriarEventoJogoDTO = z.infer<typeof SchemaBaseEventoJogo>;
export type RespostaEventoJogoDTO = z.infer<typeof SchemaEventoJogoRespostaDetalhada>;
export type AtualizarEventoJogoDTO = z.infer<typeof SchemaAtualizarEventoJogo>;
