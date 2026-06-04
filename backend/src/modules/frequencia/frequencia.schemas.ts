import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefJogo, SchemaRefTreino } from '../../shared/utils/ref.schemas';
import { FindOptionsWhere } from 'typeorm';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { Frequencia } from './frequencia.model';

export const SchemaBaseFrequencia = z.object({
    data: z.coerce.date({ error: "Data inválida" }),
    presente: z.boolean(),
    jogadorId : z.number().int().positive(),
    treinoId: z.number().int().positive().optional(),
    jogoId: z.number().int().positive().nullable().optional(),
});

export const SchemaFrequenciaResposta = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    presente: z.boolean(),
    jogador: SchemaRefJogador,
    treino: SchemaRefTreino.optional(),
    jogo: SchemaRefJogo.nullable().optional(),
});

export const SchemaFiltroFrequencia = z.object({
    chamadaId: z.number().int().positive('ID da chamada deve ser um número inteiro positivo').optional(),
    presente: z.boolean('Presente deve ser um valor booleano').optional(),
    jogadorId: z.number().int().positive('ID do jogador deve ser um número inteiro positivo').optional(),
    justificativa: z.string('Justificativa deve ser uma string').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Frequencia> = {};
    
    if (filtros.presente !== undefined) where.presente = filtros.presente;
    if (filtros.jogadorId) where.jogador = { id: filtros.jogadorId };
    if (filtros.chamadaId) where.chamada = { id: filtros.chamadaId };
    if (filtros.justificativa) where.justificativa = filtros.justificativa;
    return where;
});

export const SchemaFrequenciaId = z.object({
    id: z.coerce.number().int().positive("ID da frequência deve ser um número inteiro positivo"),
});

export const RELACOES_FREQUENCIA = [ 'jogador', 'treino', 'jogo' ] as const;
export const QueryIncludesFrequencia = criarIncludesSchema(RELACOES_FREQUENCIA);





export const SchemaAtualizarFrequencia = SchemaBaseFrequencia.partial();
export const SchemaFrequenciasPaginadas = SchemaRespostaPaginada(SchemaFrequenciaResposta);

export type FiltrosFrequenciaDTO = z.infer<typeof SchemaFiltroFrequencia>;
export type CriarFrequenciaDTO = z.infer<typeof SchemaBaseFrequencia>;
export type RespostaFrequenciaDTO = z.infer<typeof SchemaFrequenciaResposta>;
export type AtualizarFrequenciaDTO = z.infer<typeof SchemaAtualizarFrequencia>;
