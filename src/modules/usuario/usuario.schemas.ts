
import { z } from 'zod';


export const SchemaBaseUsuario = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.email("Email inválido"),
    permissao: z.enum(['admin', 'coordenador', 'professor', 'arbitro', 'auxiliar'], {
        message: "Permissão deve ser: admin, coordenador, professor, arbitro ou auxiliar"
    }),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});
export const SchemaLoginUsuario = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export const SchemaUsuarioResposta = SchemaBaseUsuario.omit({ senha: true }).extend({
    id: z.coerce.number().int().positive(),
});

export const SchemaUsuarioRelacionamento = SchemaBaseUsuario.omit({ senha: true });


export type CriarUsuarioDTO = z.infer<typeof SchemaBaseUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaUsuarioResposta>;
export type UsuarioRelacionamentoDTO = z.infer<typeof SchemaUsuarioRelacionamento>;
