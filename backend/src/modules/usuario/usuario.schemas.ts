
import { z } from 'zod';

import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { Usuario } from './Usuario.model';
import { FindOptionsWhere, ILike } from 'typeorm';
import { SchemaRefEvento, SchemaRefJogo, SchemaRefTreino } from '../../shared/utils/ref.schemas';

export const SchemaBaseUsuario = z.object({
    nome: z.string().min(1, "O nome do usuário é obrigatório"),
    email: z.email("Informe um e-mail válido"),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar'], {
        error: "Permissão inválida. Use: admin, professor, arbitro ou auxiliar",
    }),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    nucleoVinculadoId: z.number().int().positive("ID do núcleo deve ser um número inteiro positivo").nullable().optional(),
    responsavelNucleoId: z.number().int().positive("ID do responsável pelo núcleo deve ser um número inteiro positivo").nullable().optional(),
    telefone: z.string().max(11, "O telefone deve ter no máximo 11 caracteres").optional(),
}).transform(({ nucleoVinculadoId, responsavelNucleoId, ...resto }) => ({
    ...resto,
    nucleoVinculado: nucleoVinculadoId ? { id: nucleoVinculadoId } : undefined,
    responsavelNucleo: responsavelNucleoId ? { id: responsavelNucleoId } : undefined,
})); 

    
export const SchemaLoginUsuario = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),

});



export const SchemaUsuarioResumido = z.object({
    id: z.number().int().positive(),
    nome: z.string().min(1),
    email: z.email(),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar']),
    nucleoVinculado: z.object({
        id: z.number().int().positive(),
    }).nullable().optional(),
    telefone: z.string().max(11, "O telefone deve ter no máximo 11 caracteres").optional(),
});

export const SchemaUsuarioDetalhado = SchemaUsuarioResumido.extend({
    postagem: z.object({ id: z.number().int().positive(), titulo: z.string() }).optional(),
    jogos: z.array(SchemaRefJogo).optional(),
    treinos: z.array(SchemaRefTreino).optional(),
    eventos: z.array(SchemaRefEvento).optional(),
});



export const SchemaAtualizarUsuario = z.object({
    nome: z.string().min(1, "O nome do usuário é obrigatório").optional(),
    email: z.email("Informe um e-mail válido").optional(),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar'], {
        error: "Permissão inválida. Use: admin, professor, arbitro ou auxiliar",
    }).optional(),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres").optional(),
    nucleoVinculadoId: z.number().int().positive("ID do núcleo deve ser um número inteiro positivo").nullable().optional(),
    telefone: z.string().max(11, "O telefone deve ter no máximo 11 caracteres").optional(),
}).transform(({ nucleoVinculadoId, ...resto }) => ({
    ...resto,
    nucleoVinculado: nucleoVinculadoId ? { id: nucleoVinculadoId } : undefined,
}));

export const SchemaBuscarPorIdUsuario = z.object({
    id: z.coerce.number().int().positive('ID do usuário deve ser um número inteiro positivo'),
});
export const SchemaFiltrosUsuario = z.object({
    id: z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
    email: z.email().optional(),
    permissao: z.enum(['admin', 'professor', 'arbitro', 'auxiliar']).optional(),
    nucleoVinculadoId: z.coerce.number().int().positive().optional(),
    telefone: z.string().max(11, "O telefone deve ter no máximo 11 caracteres").optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Usuario> = {};
    if (filtros.id) where.id = filtros.id;
    if (filtros.nome)  where.nome = ILike(`%${filtros.nome}%`)
    if (filtros.email) where.email = ILike(filtros.email);
    if (filtros.permissao) where.permissao = filtros.permissao;
    if (filtros.nucleoVinculadoId) where.nucleoVinculado = { id: filtros.nucleoVinculadoId };
    if (filtros.telefone) where.telefone = ILike(`%${filtros.telefone}%`);
    return where;
});;

export const RELACOES_USUARIO = ['nucleoVinculado', 'jogos', 'treinos', 'eventos'] as const;
export const QueryIncludesUsuario = criarIncludesSchema(RELACOES_USUARIO);
export type AtualizarUsuarioDTO = z.infer<typeof SchemaAtualizarUsuario>;
export type CriarUsuarioDTO = z.infer<typeof SchemaBaseUsuario>;
export type LoginUsuarioDTO = z.infer<typeof SchemaLoginUsuario>;
export type RespostaUsuarioDTO = z.infer<typeof SchemaUsuarioResumido>;
export type FiltrosUsuarioDTO = z.infer<typeof SchemaFiltrosUsuario>;