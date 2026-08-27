
import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { Between, FindOptionsWhere, ILike } from 'typeorm';
import { Categoria } from './Categoria.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { SchemaRefJogo,  SchemaRefTime } from '../../shared/utils/ref.schemas';


export const SchemaCriarCategoria = z.object({
    nome: z.string().min(1, "O nome da categoria é obrigatório"),
    idadeMaxima: z.coerce.number().int().positive("Idade máxima deve ser > 0"),
    ativa: z.boolean().default(true),
});


export const SchemaBaseCategoria = z.object({
    id: z.number().int().positive(),
    nome: z.string().nonempty("O nome da categoria é obrigatório"),
    idadeMaxima: z.number().int().positive(),
    ativa: z.boolean().default(true),
    times: z.array(SchemaRefTime).optional(),
    jogos: z.array(SchemaRefJogo).optional(),
    
    createdAt: z.date().optional().default(() => new Date()),
    updatedAt: z.date().optional(),
});

export const SchemaFiltrosCategoria = z.object({
    id: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo').optional(),
    nome: z.string('O nome da categoria deve ser uma string').optional(),
    ativa: z.coerce.boolean('O status da categoria deve ser um booleano').optional(),
    idadeMaxima: z.coerce.number().int().positive('Idade máxima deve ser um número inteiro positivo').optional(),
    buscaDataInicio: z.coerce.date('A data de início da busca deve ser uma data válida').optional(),
    buscaDataFim: z.coerce.date('A data de fim da busca deve ser uma data válida').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Categoria> = {};

    if (filtros.id !== undefined) where.id = filtros.id;
    if (filtros.ativa !== undefined) where.ativa = filtros.ativa;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.idadeMaxima) where.idadeMaxima = filtros.idadeMaxima;
    if (filtros.buscaDataInicio && filtros.buscaDataFim) {
        where.createdAt = Between(filtros.buscaDataInicio, filtros.buscaDataFim);
    }

    return where;
});

export const SchemaBuscarPorIdCategoria = z.object({
    id: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo"),
});

export const SchemaBuscarPorNomeCategoria = z.object({
    nome: z.string().trim().min(1, "O nome da categoria é obrigatório").optional(),

});
export const SchemaAtualizarCategoria = SchemaCriarCategoria.partial();
export const FILTROS_PERMITIDOS_CATEGORIA = ['id', 'nome', 'ativa', 'idadeMaxima'] as const;
export const RELACOES_CATEGORIA = ['times', 'jogos'] as const; 
export const QueryIncludesCategoria = criarIncludesSchema(RELACOES_CATEGORIA);

export const SchemaCategoriasPaginadas = SchemaRespostaPaginada(SchemaBaseCategoria);
export type AtualizarCategoriaDTO = z.infer<typeof SchemaAtualizarCategoria>;
export type FiltrosCategoriaDTO = z.infer<typeof SchemaFiltrosCategoria>;
export type CriarCategoriaDTO = z.infer<typeof SchemaCriarCategoria>;
export type RespostaCategoriaDTO = z.infer<typeof SchemaBaseCategoria>;
