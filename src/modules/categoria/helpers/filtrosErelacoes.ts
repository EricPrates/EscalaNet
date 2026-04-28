import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ILike } from "typeorm";
import { Categoria } from "../Categoria.model";
import { FiltrosCategoriaDTO } from "../categoria.schemas";

export function fazerCategoriaFiltrosERelacoes(filtros?: FiltrosCategoriaDTO, includes?: string[]): { where: FindOptionsWhere<Categoria>; relations: FindOptionsRelations<Categoria>; select: FindOptionsSelect<Categoria> } {
    const relations: FindOptionsRelations<Categoria> = {};
    const where = {} as FindOptionsWhere<Categoria>;
    const select: FindOptionsSelect<Categoria> = {
        id: true,
        nome: true,
        idadeMaxima: true,
        ativa: true,

    };
    if (includes?.includes('data')) {
        select.createdAt = true;
        select.updatedAt = true;
    }

    if (includes?.includes('time')) {
        relations.times = {
            nucleo: true,
            categoria: true,
        };
        select.times = {
            id: true,
            nome: true,
            nucleo: { id: true, nome: true },
            categoria: { id: true, nome: true },
        };
    }


    
    if (filtros?.ativa !== undefined) where.ativa = filtros.ativa;
    if (filtros?.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.idadeMaxima) where.idadeMaxima = filtros.idadeMaxima;



    return { where, relations, select };
}

export const includesPermitidos = ['time', 'eventos', 'frequencias', 'data'] as string[];
