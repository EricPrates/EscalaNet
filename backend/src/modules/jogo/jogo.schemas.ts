import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefCategoria,  SchemaRefUsuario, SchemaRefChamada, SchemaRefEvento, SchemaRefTime } from '../../shared/utils/ref.schemas';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Jogo } from './Jogo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';

export const SchemaBaseJogo = z.object({
    nome: z.string().min(1, "O nome do jogo é obrigatório"),
    data: z.coerce.date({ error: "Data do jogo inválida" }),
    timeA: z.object({ id: z.number().int().positive() }),
    timeB: z.object({ id: z.number().int().positive() }),
    arbitro: z.object({ id: z.number().int().positive() }).nullable().optional(),
    categoria: z.object({ id: z.number().int().positive() }).nullable().optional(),
}).transform(({ timeA, timeB, arbitro, categoria, ...rest }) => ({
    ...rest,
    timeA: { id: timeA.id },
    timeB: { id: timeB.id },
    arbitro: arbitro ? { id: arbitro.id } : undefined,
    categoria: categoria ? { id: categoria.id } : undefined,
}));

export const SchemaJogoResposta = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    data: z.coerce.date(),
    timeA: SchemaRefTime,
    timeB: SchemaRefTime,
    arbitro: SchemaRefUsuario.nullable().optional(),
    categoria: SchemaRefCategoria.nullable().optional(),
    golsTimeA: z.number(),
    golsTimeB: z.number(),
    finalizado: z.boolean().optional(),
    chamada: SchemaRefChamada.optional(),
    eventos: z.array(SchemaRefEvento).optional(),
    evento: SchemaRefEvento.optional(),
});
export const SchemaFiltrosJogo = SchemaBaseJogo.partial().extend({
    id: z.coerce.number().int().positive('ID do jogo deve ser um número inteiro positivo').optional(),
    nome: z.string('Nome do jogo é obrigatório').optional(),
    timeA: z.object({ id: z.coerce.number().int().positive('ID do time A deve ser um número inteiro positivo') }).optional(),
    timeB: z.object({ id: z.coerce.number().int().positive('ID do time B deve ser um número inteiro positivo') }).optional(),
    arbitro: z.object({ id: z.coerce.number().int().positive('ID do árbitro deve ser um número inteiro positivo') }).optional(),
    categoria: z.object({ id: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo') }).optional(),
    golsTimeA: z.coerce.number().int().nonnegative('Gols do time A deve ser um número inteiro não negativo').optional(),
    golsTimeB: z.coerce.number().int().nonnegative('Gols do time B deve ser um número inteiro não negativo').optional(),
    data: z.coerce.date('Data do jogo deve ser uma data válida').optional(),
    chamada: z.object({ id: z.coerce.number().int().positive('ID da chamada deve ser um número inteiro positivo') }).optional(),
    evento: z.object({ id: z.coerce.number().int().positive('ID do evento deve ser um número inteiro positivo') }).optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Jogo> = {};

    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.timeA) where.timeA = { id: filtros.timeA.id };
    if (filtros.timeB) where.timeB = { id: filtros.timeB.id };
    if (filtros.arbitro) where.arbitro = { id: filtros.arbitro.id };
    if (filtros.categoria) where.categoria = { id: filtros.categoria.id };
    if (filtros.golsTimeA !== undefined) where.golsTimeA = filtros.golsTimeA;
    if (filtros.golsTimeB !== undefined) where.golsTimeB = filtros.golsTimeB;
    if (filtros.data) where.data = filtros.data;
    if (filtros.chamada) where.chamadas = { id: filtros.chamada.id };
    if(filtros.evento) where.eventos = { id: filtros.evento.id };
    return where;
});

export const RELACOES_JOGO = ['timeA', 'timeB', 'arbitro', 'categoria', 'competicao'] as const;
export const QueryIncludesJogo = criarIncludesSchema(RELACOES_JOGO);

export const SchemaAtualizarJogo = SchemaBaseJogo.partial().extend({
    golsTimeA: z.coerce.number().int().nonnegative().optional(),
    golsTimeB: z.coerce.number().int().nonnegative().optional(),
    finalizado: z.boolean().optional(),
});
export const SchemaJogosPaginados = SchemaRespostaPaginada(SchemaJogoResposta);

export type CriarJogoDTO = z.infer<typeof SchemaBaseJogo>;
export type RespostaJogoDTO = z.infer<typeof SchemaJogoResposta>;
export type AtualizarJogoDTO = z.infer<typeof SchemaAtualizarJogo>;

export const SchemaBuscarPorIdJogo = z.object({ id: z.coerce.number().int().positive('ID do jogo deve ser um número inteiro positivo') });
export const SchemaBuscarPorNucleo = z.object({ nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo') });
export const SchemaBuscarPorCategoria = z.object({ categoriaId: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo') });
