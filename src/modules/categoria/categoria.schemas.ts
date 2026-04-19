import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';

const SchemaCategoriaObjeto = z.object({
    nome: z.string().min(1, "O nome da categoria é obrigatório"),
    idadeMinima: z.number().int().nonnegative("Idade mínima deve ser >= 0"),
    idadeMaxima: z.number().int().positive("Idade máxima deve ser > 0"),
    ativa: z.boolean().default(true),
});

export const SchemaBaseCategoria = SchemaCategoriaObjeto.refine(
    d => d.idadeMaxima > d.idadeMinima,
    { message: "Idade máxima deve ser maior que a mínima", path: ["idadeMaxima"] }
);

export const SchemaCategoriaResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    idadeMinima: z.number(),
    idadeMaxima: z.number(),
    ativa: z.boolean(),
});

export const SchemaAtualizarCategoria = SchemaCategoriaObjeto.partial();
export const SchemaCategoriasPaginadas = SchemaRespostaPaginada(SchemaCategoriaResposta);

export type CriarCategoriaDTO = z.infer<typeof SchemaBaseCategoria>;
export type RespostaCategoriaDTO = z.infer<typeof SchemaCategoriaResposta>;
export type AtualizarCategoriaDTO = z.infer<typeof SchemaAtualizarCategoria>;
