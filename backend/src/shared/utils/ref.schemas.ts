import { z } from 'zod';
import { TipoEvento } from '../../modules/eventos_jogo/TipoEvento';


export const SchemaRefEvento = z.object({
    id: z.number().int().positive(),
    tipo: z.enum(TipoEvento),
    descricao: z.string().nullable().optional(),
    minuto: z.number().int().nonnegative().optional(),
    jogo: z.object({ id: z.number().int().positive(), nome: z.string(), data: z.coerce.date() }).optional(),
    time: z.object({ id: z.number().int().positive(), nome: z.string() }).optional(),
});
export const SchemaRefFrequencia = z.object({
    id: z.number().int().positive(),
    data: z.coerce.date(),
    presente: z.boolean(),
});

export const SchemaRefNucleo = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
});

export const SchemaRefCategoria = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
});

export const SchemaRefUsuario = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
});
export const SchemaRefTime = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
    nucleo: SchemaRefNucleo.optional(),
    categoria: SchemaRefCategoria.optional(),
    treinador: SchemaRefUsuario.optional(),

});
export const SchemaRefJogador = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
});

export const SchemaRefTreino = z.object({
    id: z.number().int().positive(),
    data: z.coerce.date(),
});

export const SchemaRefJogo = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
    data: z.coerce.date(),
});
