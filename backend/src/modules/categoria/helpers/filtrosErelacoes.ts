import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ILike } from "typeorm";
import { Categoria } from "../Categoria.model";
import { FiltrosCategoriaDTO } from "../categoria.schemas";

export function fazerCategoriaFiltrosERelacoes(filtros?: FiltrosCategoriaDTO): { where: FindOptionsWhere<Categoria>; relations: FindOptionsRelations<Categoria>; select: FindOptionsSelect<Categoria> } {
    const relations: FindOptionsRelations<Categoria> = {};
    const where = {} as FindOptionsWhere<Categoria>;
    const select: FindOptionsSelect<Categoria> = {
        id: true,
        nome: true,
        idadeMaxima: true,
        ativa: true,

    };
    

    
    if (filtros?.ativa !== undefined) where.ativa = filtros.ativa;
    if (filtros?.nome) where.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.idadeMaxima) where.idadeMaxima = filtros.idadeMaxima;



    return { where, relations, select };
}


