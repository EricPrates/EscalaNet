import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefNucleo } from '../../shared/utils/ref.schemas';

export const SchemaBaseTreino = z.object({
    data: z.coerce.date({ error: "Data do treino inválida" }),
    nucleo: z.object({ id: z.number().int().positive() }),
    jogadores: z.array(z.object({ id: z.number().int().positive() })).optional(),
    usuarios: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

export const SchemaTreinoResposta = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    nucleo: SchemaRefNucleo,
});

export const SchemaAtualizarTreino = SchemaBaseTreino.partial();
export const SchemaTreinosPaginados = SchemaRespostaPaginada(SchemaTreinoResposta);

export type CriarTreinoDTO = z.infer<typeof SchemaBaseTreino>;
export type RespostaTreinoDTO = z.infer<typeof SchemaTreinoResposta>;
export type AtualizarTreinoDTO = z.infer<typeof SchemaAtualizarTreino>;

export const SchemaBuscarPorIdTreino = z.object({
    id: z.coerce.number().int().positive('ID do treino deve ser um número inteiro positivo'),
});

export const SchemaBuscarPorNucleo = z.object({ nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo') });
