import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ILike } from "typeorm";
import { Jogador } from "../jogador.model";
import { FiltrosJogadorDTO } from "../jogador.schemas";
import { Time } from "../../time/time.model";

export function fazerJogadorFiltrosERelacoes(filtros?: FiltrosJogadorDTO, includes?: string[]): { where: FindOptionsWhere<Jogador>; relations: FindOptionsRelations<Jogador>; select: FindOptionsSelect<Jogador> } {
    const relations: FindOptionsRelations<Jogador> = {};
    const where = {} as FindOptionsWhere<Jogador>;
    const select: FindOptionsSelect<Jogador> = {
        id: true,
        nome: true,
        dataNascimento: true,
        ativo: true,
        telefone: true,
    };
    if (includes?.includes('data')) {
        select.createdAt = true;
        select.updatedAt = true;
    }
    
    if (includes?.includes('time')) {
        relations.time = {
            nucleo: true,
            categoria: true,
        };
        select.time = {
            id: true,
            nome: true,
            nucleo: { id: true, nome: true },
            categoria: { id: true, nome: true },
        };
    }
    if (includes?.includes('treinos')) {
        relations.treinos = true;
        select.treinos = {
            id: true,
            data: true,
        };
    }



    
    if (filtros?.ativo !== undefined) where.ativo = filtros.ativo;
    if (filtros?.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.dataNascimento) where.dataNascimento = filtros.dataNascimento;
    const timeWhere: FindOptionsWhere<Time> = {};

    if (filtros?.timeId) timeWhere.id = filtros.timeId;
    if (filtros?.treinadorId) timeWhere.treinador = { id: filtros.treinadorId };
    if (filtros?.nucleoId) timeWhere.nucleo = { id: filtros.nucleoId };     
    if (filtros?.categoriaId) timeWhere.categoria = { id: filtros.categoriaId }; 

    
    if (Object.keys(timeWhere).length > 0) {
        where.time = timeWhere;
         relations.time = relations.time ?? {};
    }


    return { where, relations, select };
}

export const includesPermitidos = ['time', 'data', 'treinos', 'eventos', 'frequencias'] as string[];
