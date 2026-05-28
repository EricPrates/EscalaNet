import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Categoria } from './Categoria.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';



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
    id: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo").optional(),
    nome: z.string().optional(),
    ativa: z.coerce.boolean().optional(),
    idadeMaxima: z.coerce.number().int().positive("Idade máxima deve ser um número inteiro positivo").optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Categoria> = {};

    if (filtros.id !== undefined) where.id = filtros.id;
    if (filtros.ativa !== undefined) where.ativa = filtros.ativa;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.idadeMaxima) where.idadeMaxima = filtros.idadeMaxima;

    return where;
});
export const SchemaBuscarPorIdCategoria = z.object({
    id: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo"),
});
export const SchemaBuscarPorNomeCategoria = z.object({
    nome: z.string().trim().min(1, "O nome da categoria é obrigatório"),
});
export const FILTROS_PERMITIDOS_CATEGORIA = ['id', 'nome', 'ativa', 'idadeMaxima'] as const;
export const RELACOES_CATEGORIA = [] as const;
export const QueryIncludesCategoria = criarIncludesSchema(RELACOES_CATEGORIA);
export const SchemaAtualizarCategoria = SchemaCriarCategoria.partial();
export const SchemaCategoriasPaginadas = SchemaRespostaPaginada(SchemaBaseCategoria);
export type FiltrosCategoriaDTO = z.infer<typeof SchemaFiltrosCategoria>;
export type CriarCategoriaDTO = z.infer<typeof SchemaCriarCategoria>;
export type RespostaCategoriaDTO = z.infer<typeof SchemaBaseCategoria>;
export type AtualizarCategoriaDTO = z.infer<typeof SchemaAtualizarCategoria>;
