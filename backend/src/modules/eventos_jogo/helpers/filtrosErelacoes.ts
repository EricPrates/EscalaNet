import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ILike } from "typeorm";
import { EventosJogo } from "../EventosJogo.model";
import { FiltrosEventoJogoDTO } from "../eventos_jogo.schemas";


export function fazerEventoJogoFiltrosERelacoes(
    filtros?: FiltrosEventoJogoDTO,
    includes?: string[]
): {
    where: FindOptionsWhere<EventosJogo>;
    relations: FindOptionsRelations<EventosJogo>;
    select: FindOptionsSelect<EventosJogo>;
} {

    const relations: FindOptionsRelations<EventosJogo> = {};
    const where = {} as FindOptionsWhere<EventosJogo>;

    const select: FindOptionsSelect<EventosJogo> = {
        id: true,
        tipo: true,
        descricao: true,
        minuto: true,
    };

    if (includes?.includes('jogo')) {
        relations.jogo = { competicao: true };
        select.jogo = {
            id: true,
            data: true,
            competicao: { id: true, nome: true },
        };
    }

    if (includes?.includes('time')) {
        relations.time = { nucleo: true };
        select.time = {
            id: true,
            nome: true,
            nucleo: { id: true, nome: true },
        };
    }

    if (includes?.includes('usuario')) {
        relations.usuario = true;
        select.usuario = { id: true, nome: true };
    }

    if (includes?.includes('jogadorEnvolvido')) {
        relations.jogadorEnvolvido = true;
        select.jogadorEnvolvido = { id: true, nome: true };
    }

    if (filtros?.tipo) {
        where.tipo = filtros.tipo;
    }

    if (filtros?.minuto !== undefined) {
        where.minuto = filtros.minuto;
    }

    if (filtros?.descricao) {
        where.descricao = ILike(`%${filtros.descricao}%`);
    }

    return { where, relations, select };
}


export const includesPermitidos = ['jogo', 'usuario', 'time', 'jogadorEnvolvido'] as string[];
