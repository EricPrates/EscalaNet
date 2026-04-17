
import { z } from 'zod';
import { SchemaBaseUsuario } from '../usuario/usuario.schemas';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';

export const SchemaDashboardNucleo = z.object({

    totalAlunos: z.number().default(0),
    totalProfessores: z.number().default(0),
    totalJogos: z.number().default(0),
    totalTreinos: z.number().default(0),

    totalCategorias: z.number().default(0),
    totalNucleos: z.number().default(0),
    
  
    crescimentoAlunos: z.number().optional(), // percentual
    jogosRealizados: z.number().optional(),
    jogosFuturos: z.number().optional(),
});




export const SchemaCriarNucleo = z.object({
    nome: z.string().min(1, "O nome do núcleo é obrigatório"),
    endereco: z.string().max(1000, "O endereço deve conter no máximo 1000 caracteres").optional(),
});

export const SchemaNucleoResposta = SchemaCriarNucleo.extend({
    id: z.coerce.number().int().positive(),
    coordenador: SchemaBaseUsuario.omit({ senha: true }).optional(),
    admin: SchemaBaseUsuario.omit({ senha: true }),
    alunos: z.array(SchemaBaseUsuario.omit({ senha: true })).optional(),
    professores: z.array(SchemaBaseUsuario.omit({ senha: true })).optional(),
});
export const SchemaNucleosPaginados = SchemaRespostaPaginada(SchemaNucleoResposta);


export type CriarNucleoDTO = z.infer<typeof SchemaCriarNucleo>;
export type RespostaNucleoDTO = z.infer<typeof SchemaNucleoResposta>;
export type DashboardNucleoDTO = z.infer<typeof SchemaDashboardNucleo>;
export type NucleosPaginadosDTO = z.infer<typeof SchemaNucleosPaginados>;