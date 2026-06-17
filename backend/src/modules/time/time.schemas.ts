import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Time } from './time.model';
import { SchemaRefCategoria, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';

export const SchemaBaseTime = z.object({
    id: z.coerce.number().int().positive("ID do time inválido"),
    nome: z.string().min(1, 'O nome do time é obrigatório'),
    nucleoId: z.coerce.number().int().positive("ID do núcleo deve ser um número inteiro positivo").optional(),
    categoriaId: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo").optional(),
    treinadorId: z.coerce.number().int().positive("ID do treinador deve ser um número inteiro positivo").optional(),
});

export const SchemaCriarTime = z.object({
    nome: z.string().min(1, 'O nome do time é obrigatório'),
    nucleoId: z.coerce.number().int().positive("ID do núcleo deve ser um número inteiro positivo").optional(),
    categoriaId: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo").optional(),
    treinadorId: z.coerce.number().int().positive("ID do treinador deve ser um número inteiro positivo").optional(),
});

export const SchemaTimeResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    nucleo: z.object(SchemaRefNucleo).optional(),
    categoria: z.object(SchemaRefCategoria).optional(),
    treinador: z.object(SchemaRefUsuario).optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const SchemaAtualizarTime = SchemaBaseTime.partial();

export const SchemaBuscarPorIdTime = z.object({
    id: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo'),
});

export const SchemaFiltrosTime = z.object({
    id: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo').optional(),
    nome: z.string('Nome do time é uma string').optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    categoriaId: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo').optional(),
    treinadorId: z.coerce.number().int().positive('ID do treinador deve ser um número inteiro positivo').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Time> = {} as any;
    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%` as any);
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId } as any;
    if (filtros.categoriaId) where.categoria = { id: filtros.categoriaId } as any;
    if (filtros.treinadorId) where.treinador = { id: filtros.treinadorId } as any;
    return where;
});

export const RELACOES_TIME = ['nucleo','categoria','treinador','jogadores','jogosComoTimeA','jogosComoTimeB','eventos','competicoes','chamadas'] as const;
export const QueryIncludesTime = criarIncludesSchema(RELACOES_TIME);
export const SchemaTimesPaginados = SchemaRespostaPaginada(SchemaBaseTime);

export type FiltrosTimeDTO = z.infer<typeof SchemaFiltrosTime>;
export type CriarTimeDTO = z.infer<typeof SchemaCriarTime>;
export type RespostaTimeDTO = z.infer<typeof SchemaBaseTime>;
export type AtualizarTimeDTO = z.infer<typeof SchemaAtualizarTime>;
