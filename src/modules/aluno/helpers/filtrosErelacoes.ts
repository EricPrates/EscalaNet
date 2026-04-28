import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ILike } from "typeorm";
import { Aluno } from "../Aluno.model";
import { FiltrosAlunoDTO } from "../aluno.schemas";
import { Time } from "../../time/time.model";

export function fazerAlunoFiltrosERelacoes(filtros?: FiltrosAlunoDTO, includes?: string[]): { where: FindOptionsWhere<Aluno>; relations: FindOptionsRelations<Aluno>; select: FindOptionsSelect<Aluno> } {
    const relations: FindOptionsRelations<Aluno> = {};
    const where = {} as FindOptionsWhere<Aluno>;
    const select: FindOptionsSelect<Aluno> = {
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


    if (includes?.includes('eventos')) {
        relations.eventos = {
            jogo: true,
            time: true,
        };
        select.eventos = {
            id: true,
            tipo: true,
            descricao: true,
            minuto: true,
            jogo: { id: true, data: true },
            time: { id: true, nome: true },
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
    }


    return { where, relations, select };
}

export const includesPermitidos = ['time', 'eventos', 'data', 'treinos'] as string[];
