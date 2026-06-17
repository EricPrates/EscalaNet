import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { Between, FindOptionsWhere } from 'typeorm';
import { Chamada } from './chamada.model';
import { SchemaRefJogo, SchemaRefNucleo, SchemaRefTime, SchemaRefTreino } from '../../shared/utils/ref.schemas';




export const SchemaCriarChamada = z.object({
    data: z.coerce.date({ message: "Data deve ser uma data válida" }),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).nullable().optional(),
    treinoId: z.coerce.number().int().positive({ message: "ID do treino deve ser um número inteiro positivo" }).nullable().optional(),
    nucleoId: z.coerce.number().int().positive({ message: "ID do núcleo deve ser um número inteiro positivo" }).optional(),
}).transform(({ timeId, jogoId, treinoId, nucleoId, ...resto }) => ({
    ...resto,
    time: { id: timeId },
    jogo: jogoId ? { id: jogoId } : undefined,
    treino: treinoId ? { id: treinoId } : undefined,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
}));

export const SchemaRepoChamada = z.object({
    data: z.coerce.date(),
    time: z.object({ id: z.number() }),
    jogo: z.object({ id: z.number() }).nullable().optional(),
    treino: z.object({ id: z.number() }).nullable().optional(),
    nucleo: z.object({ id: z.number() }).optional(),
});

export const SchemaBaseChamada = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date({ message: "Data deve ser uma data válida" }),
    treino: z.object(SchemaRefTreino).optional(),
    jogo: z.object(SchemaRefJogo).optional(),
    time: z.object(SchemaRefTime).optional(),
    nucleo: z.object(SchemaRefNucleo).optional(),
});


export const SchemaFiltrosChamada = z.object({
    dataInicio: z.coerce.date({ message: "Data deve ser uma data válida" }).optional(),
    dataFim: z.coerce.date({ message: "Data deve ser uma data válida" }).optional(),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }).optional(),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).optional(),
    treinoId: z.coerce.number().int().positive({ message: "ID do treino deve ser um número inteiro positivo" }).optional(),
    nucleoId: z.coerce.number().int().positive({ message: "ID do núcleo deve ser um número inteiro positivo" }).optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Chamada> = {};
    if (filtros.dataInicio && filtros.dataFim) {
        where.data = Between(filtros.dataInicio, filtros.dataFim);
    }
    if (filtros.timeId) where.time = { id: filtros.timeId };
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    if (filtros.jogoId) where.jogo = { id: filtros.jogoId };
    if (filtros.treinoId) where.treino = { id: filtros.treinoId };
    return where;
});
export const SchemaChamadaData = z.coerce.date({ message: "Data deve ser uma data válida" })


export const SchemaBuscarPorIdChamada = z.object({
    id: z.coerce.number().int().positive("ID da chamada deve ser um número inteiro positivo"),
});

export const RELACOES_CHAMADA = ['time', 'jogo', 'treino', 'nucleo'] as const;
export const QueryIncludesChamada = criarIncludesSchema(RELACOES_CHAMADA);

export const AtualizarChamadaSchema = z.object({
    data: z.coerce.date({ message: "Data deve ser uma data válida" }).optional(),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }).optional(),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).optional().nullable(),
    treinoId: z.coerce.number().int().positive({ message: "ID do treino deve ser um número inteiro positivo" }).optional().nullable(),
    nucleoId: z.coerce.number().int().positive({ message: "ID do núcleo deve ser um número inteiro positivo" }).optional(),
}).transform(({ timeId, jogoId, treinoId, nucleoId, ...resto }) => ({
    ...resto,
    time: timeId ? { id: timeId } : undefined,
    jogo: jogoId ? { id: jogoId } : undefined,
    treino: treinoId ? { id: treinoId } : undefined,
    nucleo: nucleoId ? { id: nucleoId } : undefined,
}));

export const SchemaChamadasPaginadas = SchemaRespostaPaginada(SchemaBaseChamada);
export type FiltrosChamadaDTO = z.infer<typeof SchemaFiltrosChamada>;
export type CriarChamadaDTO = z.infer<typeof SchemaCriarChamada>;
export type RespostaChamadaDTO = z.infer<typeof SchemaBaseChamada>;
export type CriarChamadaRepoDTO = z.infer<typeof SchemaRepoChamada>;
export type AtualizarChamadaDTO = z.infer<typeof AtualizarChamadaSchema>;