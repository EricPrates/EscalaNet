import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefCategoria, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';

export const SchemaBaseJogo = z.object({
    nome: z.string().min(1, "O nome do jogo é obrigatório"),
    data: z.coerce.date({ error: "Data do jogo inválida" }),
    timeA: z.object({ id: z.number().int().positive() }),
    timeB: z.object({ id: z.number().int().positive() }),
    arbitro: z.object({ id: z.number().int().positive() }).nullable().optional(),
    categoria: z.object({ id: z.number().int().positive() }).nullable().optional(),
    golsTimeA: z.number().int().nonnegative().default(0),
    golsTimeB: z.number().int().nonnegative().default(0),
});

export const SchemaJogoResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    data: z.coerce.date(),
    timeA: SchemaRefNucleo,
    timeB: SchemaRefNucleo,
    arbitro: SchemaRefUsuario.nullable().optional(),
    categoria: SchemaRefCategoria.nullable().optional(),
    golsTimeA: z.number(),
    golsTimeB: z.number(),
});

export const SchemaAtualizarJogo = SchemaBaseJogo.partial();
export const SchemaJogosPaginados = SchemaRespostaPaginada(SchemaJogoResposta);

export type CriarJogoDTO = z.infer<typeof SchemaBaseJogo>;
export type RespostaJogoDTO = z.infer<typeof SchemaJogoResposta>;
export type AtualizarJogoDTO = z.infer<typeof SchemaAtualizarJogo>;
