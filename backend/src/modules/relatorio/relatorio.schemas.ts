import { z } from 'zod';

// --- Filtros ---

export const SchemaFiltrosRelatorioFrequencia = z.object({
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    timeId: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo').optional(),
    jogadorId: z.coerce.number().int().positive('ID do jogador deve ser um número inteiro positivo').optional(),
    dataInicio: z.coerce.date({ error: 'Data de início inválida' }).optional(),
    dataFim: z.coerce.date({ error: 'Data de fim inválida' }).optional(),
    tipo: z.enum(['treino', 'jogo', 'todos']).default('todos'),
});

export const SchemaFiltrosRelatorioDesempenho = z.object({
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    timeId: z.coerce.number().int().positive('ID do time deve ser um número inteiro positivo').optional(),
    jogadorId: z.coerce.number().int().positive('ID do jogador deve ser um número inteiro positivo').optional(),
    jogoId: z.coerce.number().int().positive('ID do jogo deve ser um número inteiro positivo').optional(),
    competicaoId: z.coerce.number().int().positive('ID da competição deve ser um número inteiro positivo').optional(),
    dataInicio: z.coerce.date({ error: 'Data de início inválida' }).optional(),
    dataFim: z.coerce.date({ error: 'Data de fim inválida' }).optional(),
});

// --- Respostas ---

export const SchemaItemFrequenciaJogador = z.object({
    jogadorId: z.number(),
    jogadorNome: z.string(),
    timeId: z.number(),
    timeNome: z.string(),
    totalChamadas: z.number(),
    totalPresencas: z.number(),
    totalFaltas: z.number(),
    percentualPresenca: z.number(),
    faltas: z.array(z.object({
        data: z.coerce.date(),
        justificativa: z.string().nullable().optional(),
        tipo: z.enum(['treino', 'jogo']),
    })),
});

export const SchemaRelatorioFrequencia = z.object({
    periodo: z.object({
        inicio: z.coerce.date().nullable(),
        fim: z.coerce.date().nullable(),
    }),
    nucleo: z.object({ id: z.number(), nome: z.string() }).nullable().optional(),
    time: z.object({ id: z.number(), nome: z.string() }).nullable().optional(),
    totalChamadas: z.number(),
    mediaPresenca: z.number(),
    jogadores: z.array(SchemaItemFrequenciaJogador),
});

export const SchemaItemDesempenhoJogador = z.object({
    jogadorId: z.number(),
    jogadorNome: z.string(),
    timeId: z.number(),
    timeNome: z.string(),
    totalJogos: z.number(),
    gols: z.number(),
    faltas: z.number(),
    cartoesAmarelos: z.number(),
    cartoesVermelhos: z.number(),
    substituicoes: z.number(),
    escanteios: z.number(),
});

export const SchemaRelatorioDesempenho = z.object({
    periodo: z.object({
        inicio: z.coerce.date().nullable(),
        fim: z.coerce.date().nullable(),
    }),
    nucleo: z.object({ id: z.number(), nome: z.string() }).nullable().optional(),
    time: z.object({ id: z.number(), nome: z.string() }).nullable().optional(),
    totalJogos: z.number(),
    totalGols: z.number(),
    jogadores: z.array(SchemaItemDesempenhoJogador),
});

export type FiltrosRelatorioFrequenciaDTO = z.infer<typeof SchemaFiltrosRelatorioFrequencia>;
export type FiltrosRelatorioDesempenhoDTO = z.infer<typeof SchemaFiltrosRelatorioDesempenho>;
export type RelatorioFrequenciaDTO = z.infer<typeof SchemaRelatorioFrequencia>;
export type RelatorioDesempenhoDTO = z.infer<typeof SchemaRelatorioDesempenho>;
