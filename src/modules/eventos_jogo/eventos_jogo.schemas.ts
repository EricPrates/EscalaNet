import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefAluno, SchemaRefJogo, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';

const tiposEvento = ['gol', 'falta', 'cartao_amarelo', 'cartao_vermelho', 'escanteio', 'substituicao'] as const;

export const SchemaBaseEventoJogo = z.object({
    tipo: z.enum(tiposEvento),
    descricao: z.string().max(1000).nullable().optional(),
    minuto: z.number().int().nonnegative(),
    jogo: z.object({ id: z.number().int().positive() }),
    usuario: z.object({ id: z.number().int().positive() }),
    nucleo: z.object({ id: z.number().int().positive() }),
    alunoEnvolvido: z.object({ id: z.number().int().positive() }).nullable().optional(),
});

export const SchemaEventoJogoRespostaDetalhada = z.object({
    id: z.coerce.number().int().positive(),
    tipo: z.enum(tiposEvento),
    descricao: z.string().nullable().optional(),
    minuto: z.number(),
    jogo: SchemaRefJogo,
    usuario: SchemaRefUsuario,
    nucleo: SchemaRefNucleo,
    alunoEnvolvido: SchemaRefAluno.nullable().optional(),
});
export const SchemaFiltroEventoJogo = z.object({
    tipo: z.enum(tiposEvento).optional(),
    jogoId: z.coerce.number().int().positive().optional(),
    nucleoId: z.coerce.number().int().positive().optional(),
    alunoId: z.coerce.number().int().positive().optional(),
});

export const SchemaAtualizarEventoJogo = SchemaBaseEventoJogo.partial();
export const SchemaEventosJogoPaginados = SchemaRespostaPaginada(SchemaEventoJogoRespostaDetalhada);

export type CriarEventoJogoDTO = z.infer<typeof SchemaBaseEventoJogo>;
export type RespostaEventoJogoDTO = z.infer<typeof SchemaEventoJogoRespostaDetalhada>;
export type AtualizarEventoJogoDTO = z.infer<typeof SchemaAtualizarEventoJogo>;
