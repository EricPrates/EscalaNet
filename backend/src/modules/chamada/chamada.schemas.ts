import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { Between, FindOptionsWhere } from 'typeorm';
import { Chamada } from './chamada.model';



export const SchemaCriarChamada = z.object({
    data: z.coerce.date({ message: "Data deve ser uma data válida" }),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).nullable(),
    treinoId: z.coerce.number().int().positive({ message: "ID do treino deve ser um número inteiro positivo" }).nullable(),
});


export const SchemaBaseChamada = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date({ message: "Data deve ser uma data válida" }),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).nullable(),
    treinoId: z.coerce.number().int().positive().nullable(),
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
export const SchemaAtualizarChamada = SchemaCriarChamada.partial();
export const SchemaChamadasPaginadas = SchemaRespostaPaginada(SchemaBaseChamada);
export type FiltrosChamadaDTO = z.infer<typeof SchemaFiltrosChamada>;
export type CriarChamadaDTO = z.infer<typeof SchemaCriarChamada>;
export type RespostaChamadaDTO = z.infer<typeof SchemaBaseChamada>;
export type AtualizarChamadaDTO = z.infer<typeof SchemaAtualizarChamada>;
