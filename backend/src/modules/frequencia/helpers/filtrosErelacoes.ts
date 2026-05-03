import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Frequencia } from "../frequencia.model";
import { RespostaFrequenciaDTO } from "../frequencia.schemas";


export function fazerFrequenciaFiltrosERelacoes(
    filtros?: RespostaFrequenciaDTO,
    includes?: string[]
): {
    where: FindOptionsWhere<Frequencia>;
    relations: FindOptionsRelations<Frequencia>;
    select: FindOptionsSelect<Frequencia>;
} {

    const relations: FindOptionsRelations<Frequencia> = {};
    const where = {} as FindOptionsWhere<Frequencia>;

    const select: FindOptionsSelect<Frequencia> = {
        id: true,
        presente: true,
        justificativa: true,

    };

    if(includes?.includes('chamada')) {
        relations.chamada = true;
        select.chamada = { id: true, data: true };
    }

    if(includes?.includes('jogador')) {
        relations.jogador = true;
        select.jogador = { id: true, nome: true };
    }

    if(filtros?.presente !== undefined) {
        where.presente = filtros.presente;
    }

    return { where, relations, select };
}


export const includesPermitidos = ['jogo', 'jogador', 'time', 'treino'] as string[];
