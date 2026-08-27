
import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Nucleo } from './Nucleo.model';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { SchemaRefChamada, SchemaRefEvento, SchemaRefFrequencia, SchemaRefJogador, SchemaRefMaterial, SchemaRefTime, SchemaRefTreino, SchemaRefUsuario } from '../../shared/utils/ref.schemas';



export const SchemaDashboardNucleo = z.object({
    totalJogadores: z.number().default(0),
    totalProfessores: z.number().default(0),
    totalJogos: z.number().default(0),
    totalTreinos: z.number().default(0),
    totalTimes: z.number().default(0),
    totalCategorias: z.number().default(0),
    totalNucleos: z.number().default(0),
    crescimentoJogadores: z.number().optional(),
    jogosRealizados: z.number().optional(),
    jogosFuturos: z.number().optional(),
});


export const SchemaFiltrosNucleo = z.object({
    id: z.coerce.number().int().positive('ID do núcleo deve ser um número inteiro positivo').optional(),
    nome: z.string('Nome do núcleo é uma string').optional(),
    endereco: z.string('Endereço do núcleo é uma string').optional(),
    updateAt: z.coerce.date('Data de atualização deve ser uma data válida').optional(),
    createdAt: z.coerce.date('Data de criação deve ser uma data válida').optional(),
    telefone: z.string('Telefone do núcleo é uma string').optional().nullable(),
}).transform(filtros => {
    const where: FindOptionsWhere<Nucleo> = {};
    filtros.id !== undefined && (where.id = filtros.id);
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.endereco) where.endereco = ILike(`%${filtros.endereco}%`);
    if (filtros.updateAt) where.updatedAt = filtros.updateAt;
    if (filtros.createdAt) where.createdAt = filtros.createdAt;
    if (filtros.createdAt && filtros.updateAt) {
        where.createdAt = filtros.createdAt;
        where.updatedAt = filtros.updateAt;
    }
    if (filtros.telefone) where.telefone = ILike(`%${filtros.telefone}%`);
   
    return where;
});

export const SchemaBaseNucleo = z.object({
    nome: z.string().min(1, "O nome do núcleo é obrigatório"),
    endereco: z.string().max(1000, "O endereço deve conter no máximo 1000 caracteres").optional(),
});
   

export const SchemaIdNucleo = z.number().int().positive('ID do núcleo deve ser um número inteiro positivo');
export const SchemaNucleoResposta = SchemaBaseNucleo.extend({
    id: z.coerce.number().int().positive(),
    eventos:z.array(z.object(SchemaRefEvento)).optional(),
    nome: z.string(),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
    jogadores: z.array(z.object(SchemaRefJogador)).optional(),
    frequencias: z.array(z.object(SchemaRefFrequencia)).optional(),
    chamadas: z.array(z.object(SchemaRefChamada)).optional(),    
    times: z.array(z.object(SchemaRefTime)).optional(),
    treinos: z.array(z.object(SchemaRefTreino)).optional(),
    usuariosVinculados:z.array(z.object(SchemaRefUsuario)).optional(),
    materiais: z.array(z.object(SchemaRefMaterial)).optional(),
    responsavelNucleo: z.object(SchemaRefUsuario).optional().nullable(),
});

export const RELACOES_NUCLEO = ['materiais', 'times', 'treinos'] as const;
export const SchemaNucleosPaginados = SchemaRespostaPaginada(SchemaNucleoResposta);

export const SchemaAtualizarNucleo = SchemaBaseNucleo.partial();
export const QueryIncludesNucleo = criarIncludesSchema(RELACOES_NUCLEO);
export type FiltrosNucleoDTO = z.infer<typeof SchemaFiltrosNucleo>;
export type AtualizarNucleoDTO = z.infer<typeof SchemaAtualizarNucleo>;
export type CriarNucleoDTO = z.infer<typeof SchemaBaseNucleo>;
export type RespostaNucleoDTO = z.infer<typeof SchemaNucleoResposta>;
export type DashboardNucleoDTO = z.infer<typeof SchemaDashboardNucleo>;
export type NucleosPaginadosDTO = z.infer<typeof SchemaNucleosPaginados>;