import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefNucleo } from '../../shared/utils/ref.schemas';
import { FindOptionsWhere } from 'typeorm';
import { Treino } from './Treino.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';


export const SchemaBaseTreino = z.object({
    data: z.coerce.date({ error: "Data do treino inválida" }),
    nucleo: z.object({ id: z.number().int().positive() }),
    jogadores: z.array(z.object({ id: z.number().int().positive() })).optional(),
    usuarios: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

export const SchemaTreinoResposta = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    nucleo: SchemaRefNucleo,
});

export const SchemaAtualizarTreino = SchemaBaseTreino.partial();
export const SchemaTreinosPaginados = SchemaRespostaPaginada(SchemaTreinoResposta);

export type CriarTreinoDTO = z.infer<typeof SchemaBaseTreino>;
export type RespostaTreinoDTO = z.infer<typeof SchemaTreinoResposta>;
export type AtualizarTreinoDTO = z.infer<typeof SchemaAtualizarTreino>;

export const SchemaBuscarPorIdTreino = z.object({
    id: z.coerce.number().int().positive('ID do treino deve ser um número inteiro positivo'),
});
export const SchemaFiltrosTreino = z.object({
    id: z.coerce.number().int().positive('ID do treino deve ser um número inteiro positivo').optional(),
    data: z.coerce.date({ error: "Data do treino inválida" }).optional(),
    nome: z.string('Nome do treino é uma string').optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    jogadorId: z.coerce.number().int().positive('ID do jogador deve ser um número inteiro positivo').optional(),
    usuarioId: z.coerce.number().int().positive('ID do usuário deve ser um número inteiro positivo').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Treino> = {};
    if (filtros.id) where.id = filtros.id;
    if (filtros.data) where.data = filtros.data;
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    if(filtros.jogadorId) where.jogadores = { id: filtros.jogadorId };
    if(filtros.usuarioId) where.usuarios = { id: filtros.usuarioId };
    return where;
});

export const RELACOES_TREINO = ['nucleo','jogadores','usuarios'] as const;
export const QueryIncludesTreino = criarIncludesSchema(RELACOES_TREINO);
export const SchemaBuscarPorNucleo = z.object({ nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo') });
export type FiltrosTreinoDTO = z.infer<typeof SchemaFiltrosTreino>;