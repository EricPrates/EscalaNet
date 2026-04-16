import {z} from 'zod';

export const SchemaCriarUsuario = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    permissao : z.enum(['admin', 'coordenador', 'professor', 'arbitro', 'auxiliar'],
        "Permissao Deve ser de admin, coordenador, professor, arbitro ou auxiliar"),
});
export const SchemaLoginUsuario = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export const SchemaRespostausuario = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    email: z.string(),
    permissao: z.enum(['admin', 'coordenador', 'professor', 'arbitro', 'auxiliar']),
});


export const SchemaUsuarioBase = z.object({
    id: z.number().int().positive(),
    nome: z.string(),
    email: z.email(),
});

export const SchemaProfessor = SchemaUsuarioBase.extend({
    permissao: z.enum(['professor'])
});

export const SchemaAdmin = SchemaUsuarioBase.extend({
    permissao: z.enum(['admin'])
});

export const SchemaCoordenador = SchemaUsuarioBase.extend({
    permissao: z.enum(['coordenador'])
});

export const SchemaAuxiliar = SchemaUsuarioBase.extend({
    permissao: z.enum(['auxiliar'])
});


export type CriarUsuarioDTO = z.infer<typeof SchemaCriarUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaRespostausuario>;
export type UsuarioBaseDTO = z.infer<typeof SchemaUsuarioBase>;
export type ProfessorDTO = z.infer<typeof SchemaProfessor>;
export type AdminDTO = z.infer<typeof SchemaAdmin>;
export type CoordenadorDTO = z.infer<typeof SchemaCoordenador>;
export type AuxiliarDTO = z.infer<typeof SchemaAuxiliar>;