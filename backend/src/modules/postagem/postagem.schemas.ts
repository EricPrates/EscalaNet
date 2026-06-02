// src/modules/postagem/postagem.schemas.ts
import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { Between, ILike } from 'typeorm';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { SchemaRefUsuario } from '../../shared/utils/ref.schemas';

export const SchemaCriarPostagem = z.object({
    titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
    conteudo: z.string().min(10, "Conteúdo muito curto"),
    imagemUrl: z.url().optional(),
    resumo: z.string().max(300).optional(),
    status: z.enum(['rascunho', 'publicado']).default('rascunho'),
    publicadoEm: z.coerce.date().optional(),
});

export const SchemaAtualizarPostagem = SchemaCriarPostagem.partial();

export const SchemaPostagemResposta = z.object({
    id: z.number(),
    titulo: z.string(),
    conteudo: z.string(),
    imagemUrl: z.string().optional(),
    resumo: z.string().optional(),
    status: z.enum(['rascunho', 'publicado']),
    createdAt: z.date(),
    updatedAt: z.date(),
    publicadoEm: z.date().nullable().optional(),
    usuario: SchemaRefUsuario.optional(), 
});

export const SchemaFiltrosPostagem = z.object({
    status: z.enum(['rascunho', 'publicado']).optional(),
    busca: z.string().optional(),
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
}).transform(filtros => {
    const where: any = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.busca) {
        // busca por título ou resumo
        return [
            { titulo: ILike(`%${filtros.busca}%`) },
            { resumo: ILike(`%${filtros.busca}%`) }
        ];
    }
    if (filtros.dataInicio && filtros.dataFim) {
        where.publicadoEm = Between(filtros.dataInicio, filtros.dataFim);
    }
    return where;
});

// Adicione no final do arquivo postagem.schemas.ts
export const SchemaBuscarPorIdPostagem = z.object({
    id: z.coerce.number().int().positive("ID da postagem deve ser um número inteiro positivo"),
});

// Relações possíveis (se houver relacionamentos, como autor, tags, etc)
export const RELACOES_POSTAGEM = [] as const; // ou ['autor', 'categoria']
export const QueryIncludesPostagem = criarIncludesSchema(RELACOES_POSTAGEM);
export const SchemaPostagensPaginadas = SchemaRespostaPaginada(SchemaPostagemResposta);

export type CriarPostagemDTO = z.infer<typeof SchemaCriarPostagem>;
export type AtualizarPostagemDTO = z.infer<typeof SchemaAtualizarPostagem>;
export type RespostaPostagemDTO = z.infer<typeof SchemaPostagemResposta>;
export type FiltrosPostagemDTO = z.infer<typeof SchemaFiltrosPostagem>;