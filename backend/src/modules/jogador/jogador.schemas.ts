import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefEvento,  SchemaRefTime } from '../../shared/utils/ref.schemas';



export const SchemaCriarJogador = z.object({
    nome: z.string().min(1, "O nome do jogador é obrigatório"),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }),
    ativo: z.boolean().default(true),
    telefone: z.string().max(20).optional(),
    time: z.object({
        id: z.coerce.number().int().positive("ID do time é obrigatório")
    }),

});


export const SchemaJogadorResumido = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    dataNascimento: z.coerce.date(),
    ativo: z.boolean(),
    telefone: z.string().nullable().optional(),

});
export const SchemaJogadorDetalhado = SchemaJogadorResumido.extend({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    eventos: z.array(SchemaRefEvento).optional(),
    time: SchemaRefTime.optional(),

});
export const SchemaFiltrosJogador = z.object({
    id:z.number().int().positive().optional(),
    nome: z.string().optional(),
    timeId: z.number().int().positive().optional(),
    treinadorId: z.number().int().positive().optional(),
    ativo: z.coerce.boolean().optional(),
    dataNascimento: z.coerce.date().optional(),
    nucleoId: z.number().int().positive().optional(),
    categoriaId: z.number().int().positive().optional(),

});

export const SchemaBuscarPorIdJogador = z.object({
    id: z.coerce.number().int().positive("ID do jogador deve ser um número inteiro positivo"),
});

export type FiltrosJogadorDTO = z.infer<typeof SchemaFiltrosJogador>;
export const SchemaAtualizarJogador = z.object({
    nome: z.string().optional(),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }).optional(),
    ativo: z.boolean().optional(),
    telefone: z.string().max(20).optional(),
    time: z.object({
        id: z.number().int().positive("ID do time é obrigatório")
    }).optional(),
}).partial();
export const SchemaJogadoresPaginados = SchemaRespostaPaginada(SchemaJogadorResumido);

export type CriarJogadorDTO = z.infer<typeof SchemaCriarJogador>;
export type RespostaResumidaJogadorDTO = z.infer<typeof SchemaJogadorResumido>;
export type AtualizarJogadorDTO = z.infer<typeof SchemaAtualizarJogador>;
export type RespostaJogadorDetalhadoDTO = z.infer<typeof SchemaJogadorDetalhado>;
