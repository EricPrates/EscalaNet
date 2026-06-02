import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefNucleo } from '../../shared/utils/ref.schemas';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Material } from './Material';

export const SchemaBaseMaterial = z.object({
    quantidade: z.coerce.number().int().nonnegative('A quantidade deve ser um número inteiro não negativo'),
    observacao: z.string().nullable().optional(),
    tipoMaterial: z.string().max(255).optional(),
    nucleo: z.object({
        id: z.coerce.number().int().positive('ID do núcleo é obrigatório'),
    }),
    dataRecebimento: z.coerce.date({ message: "Data de recebimento deve ser uma data válida" }),
    
});

export const SchemaMaterialResposta = z.object({
    id: z.coerce.number().int().positive(),
    quantidade: z.coerce.number().int().nonnegative(),
    dataRecebimento: z.coerce.date(),
    observacao: z.string().optional(),
    tipoMaterial: z.string().optional(),
    nucleo: SchemaRefNucleo,
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const SchemaAtualizarMaterial = SchemaBaseMaterial.partial();

export const SchemaBuscarPorIdMaterial = z.object({
    id: z.coerce.number().int().positive('ID do material deve ser um número inteiro positivo'),
});

export const SchemaFiltrosMaterial = z.object({
    id: z.coerce.number().int().positive().optional(),
    quantidade: z.coerce.number().int().nonnegative().optional(),
    tipoMaterial: z.string().optional(),
    nucleoId: z.coerce.number().int().positive().optional(),
    dataRecebimento: z.coerce.date().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Material> = {};

    if (filtros.id) where.id = filtros.id;
    if (filtros.quantidade !== undefined) where.quantidade = filtros.quantidade;
    if (filtros.tipoMaterial) where.tipoMaterial = ILike(`%${filtros.tipoMaterial}%`);
    if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
    if (filtros.dataRecebimento) where.dataRecebimento = filtros.dataRecebimento;

    return where;
});

export const RELACOES_MATERIAL = ['nucleo'] as const;
export const QueryIncludesMaterial = criarIncludesSchema(RELACOES_MATERIAL);
export const SchemaMateriaisPaginados = SchemaRespostaPaginada(SchemaMaterialResposta);

export type CriarMaterialDTO = z.infer<typeof SchemaBaseMaterial>;
export type RespostaMaterialDTO = z.infer<typeof SchemaMaterialResposta>;
export type AtualizarMaterialDTO = z.infer<typeof SchemaAtualizarMaterial>;
export type FiltrosMaterialDTO = z.infer<typeof SchemaFiltrosMaterial>;