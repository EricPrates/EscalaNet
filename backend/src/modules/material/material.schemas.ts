import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefNucleo } from '../../shared/utils/ref.schemas';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Material } from './material.model';

// Schema de entrada — recebe nucleoId e transforma em { nucleo: { id } }
// para o TypeORM salvar corretamente a relação
export const SchemaBaseMaterial = z.object({
    quantidade: z.coerce.number().int().nonnegative('A quantidade deve ser um número inteiro não negativo'),
    observacao: z.string().nullable().optional(),
    tipoMaterial: z.string().max(255, 'Tipo de material deve ter no máximo 255 caracteres').optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo'),
    dataRecebimento: z.coerce.date({ message: 'Data de recebimento deve ser uma data válida' }),
}).transform(({ nucleoId, ...resto }) => ({
    ...resto,
    nucleo: { id: nucleoId },
}));

// Schema de atualização — todos opcionais, nucleoId também mapeado para nucleo
export const SchemaAtualizarMaterial = z.object({
    quantidade: z.coerce.number().int().nonnegative('A quantidade deve ser um número inteiro não negativo').optional(),
    observacao: z.string().nullable().optional(),
    tipoMaterial: z.string().max(255, 'Tipo de material deve ter no máximo 255 caracteres').optional(),
    nucleoId: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    dataRecebimento: z.coerce.date({ message: 'Data de recebimento deve ser uma data válida' }).optional(),
}).transform(({ nucleoId, ...resto }) => ({
    ...resto,
    ...(nucleoId !== undefined ? { nucleo: { id: nucleoId } } : {}),
}));

export const SchemaMaterialResposta = z.object({
    id: z.coerce.number().int().positive(),
    quantidade: z.coerce.number().int().nonnegative(),
    dataRecebimento: z.coerce.date(),
    observacao: z.string().nullable().optional(),
    tipoMaterial: z.string().optional(),
    nucleo: SchemaRefNucleo,
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

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

// Após o transform, CriarMaterialDTO tem { nucleo: { id }, ... } — sem nucleoId
export type CriarMaterialDTO = z.output<typeof SchemaBaseMaterial>;
export type AtualizarMaterialDTO = z.output<typeof SchemaAtualizarMaterial>;
export type RespostaMaterialDTO = z.infer<typeof SchemaMaterialResposta>;
export type FiltrosMaterialDTO = z.infer<typeof SchemaFiltrosMaterial>;
