import { z } from 'zod';



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

export const SchemaRefAluno = z.object({
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
