import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere } from 'typeorm';
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
    jogoId: z.coerce.number().int().positive().nullable(),
    treinoId: z.coerce.number().int().positive().nullable(),
});


export const SchemaFiltrosChamada = z.object({
    data: z.coerce.date({ message: "Data deve ser uma data válida" }).optional(),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }).optional(),
    jogoId: z.coerce.number().int().positive({ message: "ID do jogo deve ser um número inteiro positivo" }).optional(),
    treinoId: z.coerce.number().int().positive({ message: "ID do treino deve ser um número inteiro positivo" }).optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Chamada> = {};
    if (filtros.data) where.data = filtros.data;

    return where;
});
export const SchemaChamadaData = z.coerce.date({ message: "Data deve ser uma data válida" })


export const SchemaBuscarPorIdChamada = z.object({
    id: z.coerce.number().int().positive("ID da chamada deve ser um número inteiro positivo"),
});

export const RELACOES_CHAMADA = ['time', 'jogo', 'treino'] as const;
export const QueryIncludesChamada = criarIncludesSchema(RELACOES_CHAMADA);
export const SchemaAtualizarChamada = SchemaCriarChamada.partial();
export const SchemaChamadasPaginadas = SchemaRespostaPaginada(SchemaBaseChamada);
export type FiltrosChamadaDTO = z.infer<typeof SchemaFiltrosChamada>;
export type CriarChamadaDTO = z.infer<typeof SchemaCriarChamada>;
export type RespostaChamadaDTO = z.infer<typeof SchemaBaseChamada>;
export type AtualizarChamadaDTO = z.infer<typeof SchemaAtualizarChamada>;
