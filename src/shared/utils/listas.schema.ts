import { z } from 'zod';

export const SchemaPaginacaoQuery = z.object({
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().positive().max(100).default(10),
    nome: z.string().optional(),
    endereco: z.string().optional(),
});

export const SchemaRespostaPaginada = <T extends z.ZodType>(itemSchema: T) => z.object({
    data: z.array(itemSchema),
    meta: z.object({
        pagina: z.number(),
        limite: z.number(),
        total: z.number(),
        totalPaginas: z.number(),
    }),
});