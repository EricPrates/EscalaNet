import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';


export const SchemaCriarCategoria = z.object({
    nome: z.string().min(1, "O nome da categoria é obrigatório"),
    idadeMaxima: z.coerce.number().int().positive("Idade máxima deve ser > 0"),
    ativa: z.boolean().default(true),
});



export const SchemaBaseCategoria = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    idadeMaxima: z.coerce.number().int().positive(),
    ativa: z.boolean(),
});

export const SchemaFiltrosCategoria = z.object({
    nome: z.string().optional(),
    ativa: z.boolean().optional(),
    idadeMaxima: z.coerce.number().int().positive().optional(),
});
export const SchemaBuscarPorIdCategoria = z.object({
    id: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo"),
});
export const SchemaAtualizarCategoria = SchemaCriarCategoria.partial();
export const SchemaCategoriasPaginadas = SchemaRespostaPaginada(SchemaBaseCategoria);
export type FiltrosCategoriaDTO = z.infer<typeof SchemaFiltrosCategoria>;
export type CriarCategoriaDTO = z.infer<typeof SchemaCriarCategoria>;
export type RespostaCategoriaDTO = z.infer<typeof SchemaBaseCategoria>;
export type AtualizarCategoriaDTO = z.infer<typeof SchemaAtualizarCategoria>;
