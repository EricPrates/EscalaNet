
import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Nucleo } from './Nucleo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';


export const SchemaDashboardNucleo = z.object({

    totalJogadores: z.number().default(0),
    totalProfessores: z.number().default(0),
    totalJogos: z.number().default(0),
    totalTreinos: z.number().default(0),

    totalCategorias: z.number().default(0),
    totalNucleos: z.number().default(0),
    
  
    crescimentoJogadores: z.number().optional(), // percentual
    jogosRealizados: z.number().optional(),
    jogosFuturos: z.number().optional(),
});

export const SchemaFiltrosNucleo = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
    endereco: z.string().optional(),
    updateAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Nucleo> = {};
    filtros.id !== undefined && (where.id = filtros.id);
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.endereco) where.endereco = ILike(`%${filtros.endereco}%`);
    if (filtros.updateAt) where.updatedAt = filtros.updateAt;
    if (filtros.createdAt) where.createdAt = filtros.createdAt;
    return where;
});

export const SchemaBaseNucleo = z.object({
    nome: z.string().min(1, "O nome do núcleo é obrigatório"),
    endereco: z.string().max(1000, "O endereço deve conter no máximo 1000 caracteres").optional(),
});
export const SchemaIdNUcleo = z.object({
    id: z.number().int().positive(),
});
export const SchemaNucleoResposta = SchemaBaseNucleo.extend({
    id: z.coerce.number().int().positive(),
});

export const RELACOES_NUCLEO = ['materiais', 'times', 'treinos', 'usuariosVinculados'] as const;
export const SchemaNucleosPaginados = SchemaRespostaPaginada(SchemaNucleoResposta);

export const SchemaAtualizarNucleo = SchemaBaseNucleo.partial();
export const QueryIncludesNucleo = criarIncludesSchema(RELACOES_NUCLEO);
export type FiltrosNucleoDTO = z.infer<typeof SchemaFiltrosNucleo>;
export type AtualizarNucleoDTO = z.infer<typeof SchemaAtualizarNucleo>;
export type CriarNucleoDTO = z.infer<typeof SchemaBaseNucleo>;
export type RespostaNucleoDTO = z.infer<typeof SchemaNucleoResposta>;
export type DashboardNucleoDTO = z.infer<typeof SchemaDashboardNucleo>;
export type NucleosPaginadosDTO = z.infer<typeof SchemaNucleosPaginados>;