import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefJogador, SchemaRefJogo, SchemaRefTreino } from '../../shared/utils/ref.schemas';

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

export const SchemaAtualizarFrequencia = SchemaBaseFrequencia.partial();
export const SchemaFrequenciasPaginadas = SchemaRespostaPaginada(SchemaFrequenciaResposta);

export type CriarFrequenciaDTO = z.infer<typeof SchemaBaseFrequencia>;
export type RespostaFrequenciaDTO = z.infer<typeof SchemaFrequenciaResposta>;
export type AtualizarFrequenciaDTO = z.infer<typeof SchemaAtualizarFrequencia>;
