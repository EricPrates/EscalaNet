import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefEvento,  SchemaRefTime } from '../../shared/utils/ref.schemas';



export const SchemaCriarAluno = z.object({
    nome: z.string().min(1, "O nome do aluno é obrigatório"),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }),
    ativo: z.boolean().default(true),
    telefone: z.string().max(20).optional(),
    time: z.object({
        id: z.number().int().positive("ID do time é obrigatório")
    }),

});


export const SchemaAlunoResumido = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    dataNascimento: z.coerce.date(),
    ativo: z.boolean(),
    telefone: z.string().nullable().optional(),

});
export const SchemaAlunoDetalhado = SchemaAlunoResumido.extend({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    eventos: z.array(SchemaRefEvento).optional(),
    time: SchemaRefTime.optional(),

});
export const SchemaFiltrosAluno = z.object({
    id: z.number().int().positive().optional(),
    nome: z.string().optional(),
    timeId: z.number().int().positive().optional(),
    treinadorId: z.number().int().positive().optional(),
    ativo: z.coerce.boolean().optional(),
    dataNascimento: z.coerce.date().optional(),
    nucleoId: z.number().int().positive().optional(),
    categoriaId: z.number().int().positive().optional(),

});

export type FiltrosAlunoDTO = z.infer<typeof SchemaFiltrosAluno>;
export const SchemaAtualizarAluno = z.object({
    nome: z.string().min(1, "O nome do aluno é obrigatório").optional(),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }).optional(),
    ativo: z.boolean().optional(),
    telefone: z.string().max(20).optional(),
    time: z.object({
        id: z.number().int().positive("ID do time é obrigatório")
    }).optional(),
}).partial();
export const SchemaAlunosPaginados = SchemaRespostaPaginada(SchemaAlunoResumido);

export type CriarAlunoDTO = z.infer<typeof SchemaCriarAluno>;
export type RespostaResumidaAlunoDTO = z.infer<typeof SchemaAlunoResumido>;
export type AtualizarAlunoDTO = z.infer<typeof SchemaAtualizarAluno>;
export type RespostaAlunoDetalhadoDTO = z.infer<typeof SchemaAlunoDetalhado>;
