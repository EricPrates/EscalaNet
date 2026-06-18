import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefNucleo, SchemaRefUsuario } from '../../shared/utils/ref.schemas';
import { FindOptionsWhere } from 'typeorm';
import { Treino } from './Treino.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';


export const SchemaBaseTreino = z.object({
    data: z.coerce.date({ error: "Data do treino inválida" }),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo'),
    jogadoresIds: z.array(z.coerce.number().int().positive()).optional(),
    usuariosIds: z.array(z.coerce.number().int().positive()).optional(),
}).transform(({ nucleoId, jogadoresIds, usuariosIds, ...resto }) => ({
    ...resto,
    nucleo: { id: nucleoId },
    jogadores: jogadoresIds?.map(id => ({ id })) || [],
    usuarios: usuariosIds?.map(id => ({ id })) || [],
}));

export const SchemaTreinoResposta = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    nucleo: SchemaRefNucleo,
    jogadores: z.array(SchemaRefJogador).optional(),
    usuarios: z.array(SchemaRefUsuario).optional(),
});

export const SchemaCriarTreino = SchemaBaseTreino;
export const SchemaAtualizarTreino = z.object({
    data: z.coerce.date({ error: "Data do treino inválida" }).optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    jogadoresIds: z.array(z.coerce.number().int().positive()).optional(),
    usuariosIds: z.array(z.coerce.number().int().positive()).optional(),
}).transform(({ nucleoId, jogadoresIds, usuariosIds, ...resto }) => ({
    ...resto,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
    jogadores: jogadoresIds?.map(id => ({ id })) || [],
    usuarios: usuariosIds?.map(id => ({ id })) || [],
}));
export const SchemaTreinosPaginados = SchemaRespostaPaginada(SchemaTreinoResposta);

export type CriarTreinoDTO = z.output<typeof SchemaCriarTreino>;
export type RespostaTreinoDTO = z.infer<typeof SchemaTreinoResposta>;
export type AtualizarTreinoDTO = z.output<typeof SchemaAtualizarTreino>;

export const SchemaBuscarPorIdTreino = z.object({
    id: z.coerce.number().int().positive('ID do treino deve ser um número inteiro positivo'),
});
export const SchemaFiltrosTreino = z.object({
    id: z.coerce.number().int().positive('ID do treino deve ser um número inteiro positivo').optional(),
    data: z.coerce.date({ error: "Data do treino inválida" }).optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Treino> = {};
    if (filtros.id) where.id = filtros.id;
    if (filtros.data) where.data = filtros.data;
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    return where;
});

export const RELACOES_TREINO = ['nucleo','jogadores','usuarios'] as const;
export const QueryIncludesTreino = criarIncludesSchema(RELACOES_TREINO);
export const SchemaBuscarPorNucleo = z.object({ nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo') });
export type FiltrosTreinoDTO = z.infer<typeof SchemaFiltrosTreino>;