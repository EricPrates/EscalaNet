import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefJogo, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';
import { TipoEvento } from './TipoEvento';


export const SchemaBaseEventoJogo = z.object({
    tipo: z.enum(TipoEvento),
    descricao: z.string().max(1000).nullable().optional(),
    minuto: z.number().int().nonnegative(),
    jogo: z.object({ id: z.number().int().positive() }),
    usuario: z.object({ id: z.number().int().positive() }),
    nucleo: z.object({ id: z.number().int().positive() }),
    jogadorEnvolvido: z.object({ id: z.number().int().positive() }).nullable().optional(),
});

export const SchemaEventoJogoRespostaDetalhada = z.object({
    id: z.coerce.number().int().positive(),
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
    minuto: z.number().int().nonnegative().optional(),
    jogoId: z.number().int().positive().optional(),
    usuarioId: z.number().int().positive().optional(),
    nucleoId: z.number().int().positive().optional(),
    jogadorEnvolvidoId: z.number().int().positive().optional(),
    descricao: z.string().optional(),
});

export const SchemaAtualizarEventoJogo = SchemaBaseEventoJogo.partial();
export const SchemaEventosJogoPaginados = SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada);
export type FiltrosEventoJogoDTO = z.infer<typeof SchemaFiltroEventoJogo>;
export type CriarEventoJogoDTO = z.infer<typeof SchemaBaseEventoJogo>;
export type RespostaEventoJogoDTO = z.infer<typeof SchemaEventoJogoRespostaDetalhada>;
export type AtualizarEventoJogoDTO = z.infer<typeof SchemaAtualizarEventoJogo>;
