import { z } from 'zod';
// Importando os átomos do módulo de usuário
import { SchemaAdmin, SchemaCoordenador, SchemaProfessor, SchemaAuxiliar } from '../usuario/usuario.schemas';

export const SchemaRespostaNucleo = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
    endereco: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    
  
    admin: SchemaAdmin.optional(),
    coordenador: SchemaCoordenador.nullable().optional(),
    professores: z.array(SchemaProfessor).optional(),
    auxiliares: z.array(SchemaAuxiliar).optional(),

    
    categorias: z.array(z.object({
        id: z.number().int().positive(),
        nome: z.string(),
        ativa: z.boolean()
    })).optional(),
});

export const SchemaCriarNucleo = z.object({
    nome: z.string().min(1, "O nome do núcleo é obrigatório"),
    endereco: z.string().max(1000, "O endereço deve conter no máximo 1000 caracteres").optional(),
});

export const SchemaDashboardNucleo = z.object({
    totalAlunos: z.number().default(0),
    totalProfessores: z.number().default(0),
    totalJogos: z.number().default(0),
    totalTreinos: z.number().default(0),
});


export type CriarNucleoDTO = z.infer<typeof SchemaCriarNucleo>;
export type RespostaNucleoDTO = z.infer<typeof SchemaRespostaNucleo>;
export type DashboardNucleoDTO = z.infer<typeof SchemaDashboardNucleo>;
