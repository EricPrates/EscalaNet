import { z } from 'zod';
import { SchemaBaseNucleo } from '../nucleo/nucleo.schemas';
import { SchemaBaseCategoria } from '../categoria/categoria.schemas';

export const SchemaBaseAluno = z.object({
    nome: z.string().min(1),
    dataNascimento: z.coerce.date().optional(),
    telefone: z.string().optional(),
    emailResponsavel: z.string().email().optional(),
    nucleoId: z.number().int().positive(),
    categoriaId: z.number().int().positive().optional(),
});

export const SchemaCriarAluno = SchemaBaseAluno;
export type CriarAlunoDTO = z.infer<typeof SchemaCriarAluno>;

export const SchemaAtualizarAluno = SchemaBaseAluno.partial();
export type AtualizarAlunoDTO = z.infer<typeof SchemaAtualizarAluno>;

export const SchemaAlunoResposta = SchemaBaseAluno.omit({
    nucleoId: true,
    categoriaId: true,
}).extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    nucleo: SchemaBaseNucleo,
    categoria: SchemaBaseCategoria.nullable(),
});
export type RespostaAlunoDTO = z.infer<typeof SchemaAlunoResposta>;