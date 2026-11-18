
import { z } from 'zod';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { Between, FindOptionsWhere, ILike, In } from 'typeorm';
import { Categoria } from './Categoria.model';
import { SchemaRefJogador, SchemaRefJogo,  SchemaRefTime } from '../../shared/utils/ref.schemas';
import { sexo } from './Categoria.model';



export const SchemaCriarCategoria = z.object({
    nome: z.string().min(1, "O nome da categoria é obrigatório"),
    idadeMaxima: z.coerce.number().int().positive("Idade máxima deve ser > 0"),
    ativa: z.coerce.boolean().default(true),
    sexo: z.enum(sexo).nullable().optional(),
    
});


export const SchemaBaseCategoria = z.object({
    id: z.coerce.number().int().positive(),
    nome: z.string().nonempty("O nome da categoria é obrigatório"),
    idadeMaxima: z.coerce.number().int().positive(),
    ativa: z.coerce.boolean().default(true),
    times: z.array(SchemaRefTime).optional(),
    jogos: z.array(SchemaRefJogo).optional(),
    sexo: z.enum(sexo).nullable().optional(),
    jogadores: z.array(SchemaRefJogador).optional(),
})  .transform(({ times, jogos, jogadores, ...resto }) => ({
    ...resto,
    timesIds: times ? times.map(time => time.id) : undefined,
    jogosIds: jogos ? jogos.map(jogo => jogo.id) : undefined,
    jogadoresIds: jogadores ? jogadores.map(jogador => jogador.id) : undefined,
}));

export const SchemaFiltrosCategoria = z.object({
    id: z.coerce.number().int().positive('ID da categoria deve ser um número inteiro positivo').optional(),
    nome: z.string('O nome da categoria deve ser uma string').optional(),
    ativa: z.stringbool('O status da categoria deve ser um booleano').optional(),
    idadeMaxima: z.coerce.number().int().positive('Idade máxima deve ser um número inteiro positivo').optional(),
    buscaDataInicio: z.coerce.date('A data de início da busca deve ser uma data válida').optional(),
    buscaDataFim: z.coerce.date('A data de fim da busca deve ser uma data válida').optional(),
    sexo: z.enum(sexo).optional(),
    jogadoresIds: z.array(z.coerce.number().int().positive('ID do jogador deve ser um número inteiro positivo')).optional(),
}).transform(filtros => {
    const where: FindOptionsWhere<Categoria> = {};

    if (filtros.id !== undefined) where.id = filtros.id;
    if (filtros.ativa !== undefined) where.ativa = filtros.ativa;
    if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros.idadeMaxima) where.idadeMaxima = filtros.idadeMaxima;
    if (filtros.buscaDataInicio && filtros.buscaDataFim) {
        where.createdAt = Between(filtros.buscaDataInicio, filtros.buscaDataFim);
    }
    if (filtros.sexo) where.sexo = filtros.sexo;
    if (filtros.jogadoresIds && filtros.jogadoresIds.length > 0) {
        where.jogadores = { id: In(filtros.jogadoresIds) } as FindOptionsWhere<Categoria>['jogadores'];
    }
    return where;
});

export const SchemaBuscarPorIdCategoria = z.object({
    id: z.coerce.number().int().positive("ID da categoria deve ser um número inteiro positivo"),
});

export const SchemaAtualizarCategoria = SchemaCriarCategoria.partial();

export const SchemaCategoriasPaginadas = SchemaRespostaPaginada(SchemaBaseCategoria);
export type AtualizarCategoriaDTO = z.infer<typeof SchemaAtualizarCategoria>;
export type FiltrosCategoriaDTO = z.infer<typeof SchemaFiltrosCategoria>;
export type CriarCategoriaDTO = z.infer<typeof SchemaCriarCategoria>;
export type RespostaCategoriaDTO = z.infer<typeof SchemaBaseCategoria>;
