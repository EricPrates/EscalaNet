import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { SchemaRefEvento,  SchemaRefNucleo,  SchemaRefTime } from '../../shared/utils/ref.schemas';
import { criarIncludesSchema } from '../../shared/utils/query.schema';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Jogador } from './jogador.model';



export const SchemaCriarJogador = z.object({
    nome: z.string().min(1, "O nome do jogador é obrigatório"),
    cpf: z.string().min(1, "O CPF do jogador é obrigatório"),
    responsavel: z.string().min(1, "O nome do responsável é obrigatório"),
    dataNascimento: z.coerce.date({ error: "Data de nascimento inválida" }),
    ativo: z.boolean().default(true),
    telefone: z.string().max(20).optional(),
    timeId: z.coerce.number().int().positive({ message: "ID do time deve ser um número inteiro positivo" }).optional(),
    nucleoId: z.coerce.number().int().positive({ message: "ID do núcleo deve ser um número inteiro positivo" }).optional(),
    matricula: z.string(),
}).transform(({ timeId, nucleoId, ...resto }) => ({
    ...resto,
    time: timeId ? { id: timeId } : undefined,
    nucleo: nucleoId? { id: nucleoId } : undefined,
}));

export const SchemaBaseJogador = SchemaCriarJogador;


export const SchemaJogadorResumido = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string(),
    dataNascimento: z.coerce.date(),
    ativo: z.boolean(),
    telefone: z.string().nullable().optional(),
    matricula: z.string().optional(),
});
export const SchemaJogadorDetalhado = SchemaJogadorResumido.extend({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    eventos: z.array(SchemaRefEvento).optional(),
    time: SchemaRefTime.optional(),
    nucleo : SchemaRefNucleo.optional(),

});

export const SchemaBuscarPorIdJogador = z.object({
    id: z.coerce.number().int().positive("ID do jogador deve ser um número inteiro positivo"),
});

export type FiltrosJogadorDTO = z.infer<typeof SchemaFiltrosJogador>;
export const SchemaAtualizarJogador = z.object({
       nome: z.string().min(1, "O nome do jogador é obrigatório").optional(),
    dataNascimento: z.coerce.date({ error: "Informe uma data de nascimento válida" }).optional(),
    ativo: z.boolean({ error: "O campo 'ativo' deve ser verdadeiro ou falso" }).optional(),
    telefone: z.string().max(20, "O telefone deve ter no máximo 20 caracteres").optional(),
    time: z.object({
        id: z.coerce.number().int().positive("ID do time deve ser um número inteiro positivo"),
    }).optional(),
    matricula: z.string().optional(),
});
export const SchemaJogadoresPaginados = SchemaRespostaPaginada(SchemaJogadorResumido);

export const SchemaFiltrosJogador = z.object({
    id:z.coerce.number().int().positive().optional(),
    nome: z.string().optional(),
    timeId: z.coerce.number().int().positive().optional(),
    treinadorId: z.coerce.number().int().positive().optional(),
    ativo: z.coerce.boolean().optional(),
    dataNascimento: z.coerce.date().optional(),
    nucleoId: z.coerce.number().int().positive().optional(),
    categoriaId: z.coerce.number().int().positive().optional(),
    responsavel: z.string().optional(),
    cpf: z.string().optional(),
    matricula: z.string().optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Jogador> = {};
    
    if (filtros.id) where.id = filtros.id;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.timeId) where.time = { id: filtros.timeId };
    if (filtros.treinadorId) where.time = { treinador: { id: filtros.treinadorId } };
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo;
    if (filtros.dataNascimento) where.dataNascimento = filtros.dataNascimento;
    if (filtros.nucleoId) where.time = { nucleo: { id: filtros.nucleoId } };
    if (filtros.categoriaId) where.time = { categoria: { id: filtros.categoriaId } };
    if (filtros.responsavel) where.responsavel = ILike(`%${filtros.responsavel}%`);
    if (filtros.cpf) where.cpf = ILike(`%${filtros.cpf}%`);
    if (filtros.matricula) where.matricula = ILike(`%${filtros.matricula}%`);
    return where;
});

export const RELACOES_JOGADOR = [ 'time, nucleo'] as const;
export const QueryIncludesJogador = criarIncludesSchema(RELACOES_JOGADOR);

export type CriarJogadorDTO = z.infer<typeof SchemaBaseJogador>;
export type RespostaResumidaJogadorDTO = z.infer<typeof SchemaJogadorResumido>;
export type AtualizarJogadorDTO = z.infer<typeof SchemaAtualizarJogador>;
export type RespostaJogadorDetalhadoDTO = z.infer<typeof SchemaJogadorDetalhado>;
