import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefCategoria, SchemaRefUsuario, SchemaRefChamada, SchemaRefEvento, SchemaRefTime } from '../../shared/utils/ref.schemas';
import { Between, FindOptionsWhere, ILike } from 'typeorm';
import { Jogo } from './Jogo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';

export const SchemaBaseJogo = z.object({
    nome: z.string().min(1, "O nome do jogo é obrigatório"),
    data: z.coerce.date({ error: "Data do jogo inválida" }),
    timeAId: z.number().int().positive({ message: "ID do time A deve ser um número inteiro positivo e é obrigatório" }),
    timeBId: z.number().int().positive({ message: "ID do time B deve ser um número inteiro positivo e é obrigatório" }),
    arbitroId: z.number().int().positive({ message: "ID do árbitro deve ser um número inteiro positivo" }).nullable().optional(),
    categoriaId: z.number().int().positive({ message: "ID da categoria deve ser um número inteiro positivo" }).nullable().optional(),

}).transform(({ timeAId, timeBId, arbitroId, categoriaId, ...resto }) => ({
    ...resto,
    timeA: { id: timeAId },
    timeB: { id: timeBId },
    arbitro: arbitroId ? { id: arbitroId } : undefined,
    categoria: categoriaId ? { id: categoriaId } : undefined,
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
    chamadas: z.array(SchemaRefChamada).optional(),
    eventos: z.array(SchemaRefEvento).optional(),
});
export const SchemaFiltrosJogo = z.object({
    id: z.coerce.number().int().positive('ID do jogo deve ser um número inteiro positivo').optional(),
    nome: z.string('Nome do jogo é obrigatório').optional(),
    timeA: z.number().int().positive({ message: "ID do time A deve ser um número inteiro positivo e é obrigatório" }).optional(),
    timeB: z.number().int().positive({ message: "ID do time B deve ser um número inteiro positivo e é obrigatório" }).optional(),
    arbitroId: z.number().int().positive({ message: "ID do árbitro deve ser um número inteiro positivo" }).nullable().optional(),
    categoria: z.number().int().positive({ message: "ID da categoria deve ser um número inteiro positivo" }).nullable().optional(),
    golsTimeA: z.coerce.number().int().nonnegative('Gols do time A deve ser um número inteiro não negativo').optional(),
    golsTimeB: z.coerce.number().int().nonnegative('Gols do time B deve ser um número inteiro não negativo').optional(),
    data: z.coerce.date('Data do jogo deve ser uma data válida').optional(),
    dataInicial: z.coerce.date('Data inicial deve ser uma data válida').optional(),
    dataFinal: z.coerce.date('Data final deve ser uma data válida').optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Jogo> = {};

    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.timeA) where.timeA = { id: filtros.timeA };
    if (filtros.timeB) where.timeB = { id: filtros.timeB };
    if (filtros.arbitroId) where.arbitro = { id: filtros.arbitroId };
    if (filtros.categoria) where.categoria = { id: filtros.categoria };
    if (filtros.golsTimeA !== undefined) where.golsTimeA = filtros.golsTimeA;
    if (filtros.golsTimeB !== undefined) where.golsTimeB = filtros.golsTimeB;
    if (filtros.data) where.data = filtros.data;
    if(filtros.dataInicial && filtros.dataFinal) {
        where.data = Between(filtros.dataInicial, filtros.dataFinal);
    }
    return where;
});

export const RELACOES_JOGO = ['timeA', 'timeB', 'arbitro', 'categoria', 'competicao'] as const;
export const QueryIncludesJogo = criarIncludesSchema(RELACOES_JOGO);

export const SchemaAtualizarJogo = z.object({
    nome: z.string().min(1, "O nome do jogo deve ter pelo menos 1 caractere").optional(),
    data: z.coerce.date({ error: "Data do jogo inválida" }).optional(),
    timeAId: z.number().int().positive({ message: "ID do time A deve ser um número inteiro positivo e é obrigatório" }).optional(),
    timeBId: z.number().int().positive({ message: "ID do time B deve ser um número inteiro positivo e é obrigatório" }).optional(),
    arbitroId: z.number().int().positive({ message: "ID do árbitro deve ser um número inteiro positivo" }).nullable().optional(),
    categoriaId: z.number().int().positive({ message: "ID da categoria deve ser um número inteiro positivo" }).nullable().optional(),
}).transform(({ timeAId, timeBId, arbitroId, categoriaId, ...resto }) => ({
    ...resto,
    timeA: timeAId ? { id: timeAId } : undefined,
    timeB: timeBId ? { id: timeBId } : undefined,
    arbitro: arbitroId ? { id: arbitroId } : undefined,
    categoria: categoriaId ? { id: categoriaId } : undefined
}));
export const SchemaJogosPaginados = SchemaRespostaPaginada(SchemaJogoResposta);

export type CriarJogoDTO = z.infer<typeof SchemaBaseJogo>;
export type RespostaJogoDTO = z.infer<typeof SchemaJogoResposta>;
export type AtualizarJogoDTO = z.infer<typeof SchemaAtualizarJogo>;
export type FiltrosJogoDTO = z.infer<typeof SchemaFiltrosJogo>;
export const SchemaBuscarPorIdJogo = z.object({ id: z.coerce.number().int().positive('ID do jogo deve ser um número inteiro positivo') });
export const SchemaBuscarPorNucleo = z.object({ nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo') });
export const SchemaBuscarPorCategoria = z.object({ categoriaId: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo') });
