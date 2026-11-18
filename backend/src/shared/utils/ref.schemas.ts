import { z } from 'zod';



export const SchemaRefEvento = z.object({
    id: z.number().int().positive(),
    tipo: z.enum(["gol", "falta", "cartao_amarelo", "cartao_vermelho", "escanteio", "substituicao"]),
    descricao: z.string().nullable().optional(),
    minuto: z.coerce.number().int().nonnegative().optional(),
    jogo: z.object({ id: z.coerce.number().int().positive(), nome: z.string(), data: z.coerce.date() }).optional(),
    time: z.object({ id: z.coerce.number().int().positive(), nome: z.string() }).optional(),
});
export const SchemaRefFrequencia = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    presente: z.boolean(),
});

export const SchemaRefCompeticao = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
});
export const SchemaRefNucleo = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
});

export const SchemaRefCategoria = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
});

export const SchemaRefUsuario = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
});
export const SchemaRefTime = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
    nucleo: SchemaRefNucleo.optional(),
    categoria: SchemaRefCategoria.optional(),
    treinador: SchemaRefUsuario.optional(),

});

export const SchemaRefMaterial = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
    quantidade: z.coerce.number().int().nonnegative(),
    descricao: z.string().optional(),
    tipoMaterial: z.string().optional(),
    dataRecebimento: z.coerce.date().optional(),
});
export const SchemaRefChamada = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date(),
    time: SchemaRefTime.optional(),
});
export const SchemaRefJogador = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
});

export const SchemaRefTreino = z.object({
    id: z.coerce.number().int().positive(),
    data: z.coerce.date().optional(),
});

export const SchemaRefJogo = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().optional(),
    data: z.coerce.date().optional(),
});
