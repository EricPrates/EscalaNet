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
export const SchemaBuscarUsuario = z.object({
    id: z.number().optional().transform(Number),
    email: z.email().optional(),
});



export type CriarUsuarioDTO = z.infer<typeof SchemaCriarUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaRespostausuario>;
export type BuscarUsuarioDTO = z.infer<typeof SchemaBuscarUsuario>;