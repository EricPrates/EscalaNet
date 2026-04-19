import { z } from 'zod';


export const SchemaBaseAluno = z.object({
    nome: z.string().min(1),
    dataNascimento: z.coerce.date(),
    telefone: z.string().optional(),
    nucleoId: z.number().int().positive(),
    categoriaId: z.number().int().positive(),
});

export const SchemaCriarAluno = SchemaBaseAluno;
export type CriarAlunoDTO = z.infer<typeof SchemaCriarAluno>;

export const SchemaAtualizarAluno = SchemaBaseAluno.partial();
export type AtualizarAlunoDTO = z.infer<typeof SchemaAtualizarAluno>;


export type RespostaAlunoDTO = z.infer<typeof SchemaBaseAluno>;