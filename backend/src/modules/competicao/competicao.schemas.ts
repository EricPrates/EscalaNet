import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Competicao } from './Competicao.model';

export const SchemaBaseCompeticao = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().min(1, 'O nome da competição é obrigatório'),
    tipo: z.enum(['Copa', 'Liga']),
});

export const SchemaCriarCompeticao = SchemaBaseCompeticao.omit({ id: true });
export const SchemaAtualizarCompeticao = SchemaCriarCompeticao.partial();

export const SchemaBuscarPorIdCompeticao = z.object({
    id: z.coerce.number().int().positive('ID da competição deve ser um número inteiro positivo'),
});

export const SchemaFiltrosCompeticao = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
    tipo: z.enum(['Copa', 'Liga']).optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Competicao> = {};

    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.tipo) where.tipo = filtros.tipo;

    return where;
});

export const RELACOES_COMPETICAO = ['jogos', 'times'] as const;
export const QueryIncludesCompeticao = criarIncludesSchema(RELACOES_COMPETICAO);
export const SchemaCompeticoesPaginadas = SchemaRespostaPaginada(SchemaBaseCompeticao);

export type FiltrosCompeticaoDTO = z.infer<typeof SchemaFiltrosCompeticao>;
export type CriarCompeticaoDTO = z.infer<typeof SchemaCriarCompeticao>;
export type RespostaCompeticaoDTO = z.infer<typeof SchemaBaseCompeticao>;
export type AtualizarCompeticaoDTO = z.infer<typeof SchemaAtualizarCompeticao>;