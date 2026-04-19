
import { z } from 'zod';
import { SchemaBaseNucleo } from '../nucleo/nucleo.schemas';


export const SchemaBaseUsuario = z.object({
     nome: z.string().min(1),
    email: z.email(),
    permissao: z.enum(['admin', 'coordenador', 'professor', 'arbitro', 'auxiliar']),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    nucleoVinculado: z.object({ id: z.number().int().positive(),
     }).nullable().optional(),
  
});
export const SchemaLoginUsuario = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),

});

export const SchemaUsuarioResumido = z.object({
    id: z.number(),
    nome: z.string(),
    email: z.email(),
    permissao: z.enum(['admin', 'coordenador', 'professor', 'arbitro', 'auxiliar']),
    nucleoVinculado: z.object({ id: z.number().int().positive(),
        nome: z.string().min(1),
     }).nullable().optional(),
  
});

export const SchemaUsuarioDetalhado = SchemaUsuarioResumido.extend({
    nucleoVinculado: SchemaBaseNucleo.nullable().optional(),
    nucleosAdministrados: z.array(SchemaBaseNucleo).optional(),
});


export const SchemaUsuarioRelacionamento = SchemaBaseUsuario.omit({ senha: true });
export const SchemaAtualizarUsuario = SchemaBaseUsuario.partial();

export type AtualizarUsuarioDTO = z.infer<typeof SchemaAtualizarUsuario>;
export type CriarUsuarioDTO = z.infer<typeof SchemaBaseUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaUsuarioResumido>;
export type UsuarioRelacionamentoDTO = z.infer<typeof SchemaUsuarioRelacionamento>;
