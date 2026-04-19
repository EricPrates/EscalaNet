import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefCategoria, SchemaRefNucleo } from '../../shared/utils/ref.schemas';

export const SchemaBaseAluno = z.object({
    nome: z.string().min(1, "O nome do aluno é obrigatório"),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }),
    ativo: z.boolean().default(true),
    telefone: z.string().max(20).optional(),
    nucleo: z.object({ id: z.number().int().positive() }),
    categoria: z.object({ id: z.number().int().positive() }).optional(),
});

export const SchemaAlunoResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    dataNascimento: z.coerce.date(),
    ativo: z.boolean(),
    telefone: z.string().nullable().optional(),
    nucleo: SchemaRefNucleo,
    categoria: SchemaRefCategoria.nullable().optional(),
});

export const SchemaAtualizarAluno = SchemaBaseAluno.partial();
export const SchemaAlunosPaginados = SchemaRespostaPaginada(SchemaAlunoResposta);

export type CriarAlunoDTO = z.infer<typeof SchemaBaseAluno>;
export type RespostaAlunoDTO = z.infer<typeof SchemaAlunoResposta>;
export type AtualizarAlunoDTO = z.infer<typeof SchemaAtualizarAluno>;
