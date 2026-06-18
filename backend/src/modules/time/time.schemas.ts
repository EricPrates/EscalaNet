import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Time } from './time.model';
import { SchemaRefCategoria, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';

export const SchemaBaseTime = z.object({
    nome: z.string().min(1, 'O nome do time é obrigatório'),
    nucleoId: z.coerce.number().int().positive("ID do núcleo deve ser um número inteiro positivo").optional(),
    categoriaId: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo").optional(),
    treinadorId: z.coerce.number().int().positive("ID do treinador deve ser um número inteiro positivo").optional(),
}).transform(({ nucleoId, categoriaId, treinadorId, ...resto }) => ({
    ...resto,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
    categoria: categoriaId ? { id: categoriaId } : undefined,
    treinador: treinadorId ? { id: treinadorId } : undefined,
}));

export const SchemaTimeResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    nucleo: SchemaRefNucleo.optional(),
    categoria: SchemaRefCategoria.optional(),
    treinador: SchemaRefUsuario.optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const SchemaCriarTime = SchemaBaseTime;

export const SchemaAtualizarTime = z.object({
    nome: z.string().min(1, 'O nome do time é obrigatório').optional(),
    nucleoId: z.coerce.number().int().positive("ID do núcleo deve ser um número inteiro positivo").optional(),
    categoriaId: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo").optional(),
    treinadorId: z.coerce.number().int().positive("ID do treinador deve ser um número inteiro positivo").optional(),
}).transform(({ nucleoId, categoriaId, treinadorId, ...resto }) => ({
    ...resto,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
    categoria: categoriaId ? { id: categoriaId } : undefined,
    treinador: treinadorId ? { id: treinadorId } : undefined,
}));

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
    const where: FindOptionsWhere<Time> = {};
    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    if (filtros.categoriaId) where.categoria = { id: filtros.categoriaId };
    if (filtros.treinadorId) where.treinador = { id: filtros.treinadorId };
    return where;
});

export const RELACOES_TIME = ['nucleo','categoria','treinador','jogadores','jogosComoTimeA','jogosComoTimeB','eventos','competicoes','chamadas'] as const;
export const QueryIncludesTime = criarIncludesSchema(RELACOES_TIME);
export const SchemaTimesPaginados = SchemaRespostaPaginada(SchemaTimeResposta);

export type FiltrosTimeDTO = z.infer<typeof SchemaFiltrosTime>;
export type CriarTimeDTO = z.infer<typeof SchemaCriarTime>;
export type RespostaTimeDTO = z.infer<typeof SchemaTimeResposta>;
export type AtualizarTimeDTO = z.infer<typeof SchemaAtualizarTime>;
