import { z } from 'zod';

// Schemas de referência reutilizados nas respostas de outros módulos
// Retornam apenas id + nome para evitar N+1 no frontend

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
