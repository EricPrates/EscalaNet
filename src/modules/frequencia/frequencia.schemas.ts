import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefAluno, SchemaRefJogo, SchemaRefTreino } from '../../shared/utils/ref.schemas';

export const SchemaBaseFrequencia = z.object({
    data: z.coerce.date({ error: "Data inválida" }),
    presente: z.boolean(),
    aluno: z.object({ id: z.number().int().positive() }),
    treino: z.object({ id: z.number().int().positive() }),
    jogo: z.object({ id: z.number().int().positive() }).nullable().optional(),
});

export const SchemaFrequenciaResposta = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    presente: z.boolean(),
    aluno: SchemaRefAluno,
    treino: SchemaRefTreino,
    jogo: SchemaRefJogo.nullable().optional(),
});

export const SchemaAtualizarFrequencia = SchemaBaseFrequencia.partial();
export const SchemaFrequenciasPaginadas = SchemaRespostaPaginada(SchemaFrequenciaResposta);

export type CriarFrequenciaDTO = z.infer<typeof SchemaBaseFrequencia>;
export type RespostaFrequenciaDTO = z.infer<typeof SchemaFrequenciaResposta>;
export type AtualizarFrequenciaDTO = z.infer<typeof SchemaAtualizarFrequencia>;
