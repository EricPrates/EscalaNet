
import { z } from 'zod';
import { SchemaBaseNucleo } from '../nucleo/nucleo.schemas';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { Usuario } from './Usuario.model';
import { FindOptionsWhere, ILike } from 'typeorm';
import { SchemaRefEvento, SchemaRefJogo, SchemaRefTreino } from '../../shared/utils/ref.schemas';


export const SchemaBaseUsuario = z.object({
    nome: z.string().min(1, "O nome do usuário é obrigatório"),
    email: z.email("Informe um e-mail válido"),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar']),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    nucleoVinculado: z.object({
        id: z.number().int().positive("ID do núcleo deve ser um número inteiro positivo"),
    }).nullable().optional(),
    
});
export const SchemaLoginUsuario = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),

});

export const SchemaUsuarioResumido = z.object({
    id: z.number().int().positive("ID do usuário inválido"),
    nome: z.string().min(1, "O nome do usuário é obrigatório"),
    email: z.email("Informe um e-mail válido"),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar'], {
        error: "Permissão inválida. Use: admin, professor, arbitro ou auxiliar",
    }),
    nucleoVinculadoId: z.number().int().positive("ID do núcleo deve ser um número inteiro positivo").nullable().optional(),

});



export const SchemaUsuarioDetalhado = SchemaUsuarioResumido.extend({
    nucleoVinculado: SchemaBaseNucleo.nullable().optional(),
    postagem: z.object({
        id: z.number().int().positive(),
        titulo: z.string(),
    }).optional(),
    jogos: z.array(z.object(SchemaRefJogo)).optional(),
    treinos: z.array(z.object(SchemaRefTreino)).optional(),
    eventos: z.array(z.object(SchemaRefEvento)).optional(),
});



export const SchemaAtualizarUsuario = SchemaBaseUsuario.partial();

export const SchemaBuscarPorIdUsuario = z.object({
    id: z.coerce.number().int().positive('ID do usuário deve ser um número inteiro positivo'),
});
export const SchemaFiltrosUsuario = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
    email: z.email().optional(),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar']).optional(),
    nucleoVinculadoId: z.coerce.number().int().positive().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Usuario> = {};
    if (filtros.id) where.id = filtros.id;
    if (filtros.nome)  where.nome = ILike(`%${filtros.nome}%`)
    if (filtros.email) where.email = ILike(filtros.email);
    if (filtros.permissao) where.permissao = filtros.permissao;
    if (filtros.nucleoVinculadoId) where.nucleoVinculado = { id: filtros.nucleoVinculadoId };
    if (Object.keys(where).length === 0) {
        throw new Error('Pelo menos um filtro deve ser fornecido');
    }
    return where;
});;

export const RELACOES_USUARIO = ['nucleoVinculado', 'jogos', 'treinos', 'eventos'] as const;
export const QueryIncludesUsuario = criarIncludesSchema(RELACOES_USUARIO);
export type AtualizarUsuarioDTO = z.infer<typeof SchemaAtualizarUsuario>;
export type CriarUsuarioDTO = z.infer<typeof SchemaBaseUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaUsuarioResumido>;
export type FiltrosUsuarioDTO = z.infer<typeof SchemaFiltrosUsuario>;