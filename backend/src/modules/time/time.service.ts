import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { ITimeRepository, ITimeService } from "./time.interfaces";
import { Time } from "./time.model";
import { CriarTimeDTO, SchemaBaseTime, AtualizarTimeDTO, FiltrosTimeDTO } from "./time.schemas";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";

export function fazerTimeService(timeRepo: ITimeRepository): ITimeService {
    return {
        async listar(pagina: number, limite: number, where?: FiltrosTimeDTO, relations?: FindOptionsRelations<Time>) {
            const { data, total } = await timeRepo.listar(pagina, limite, where as FindOptionsWhere<Time> | undefined, relations);
            return SchemaRespostaPaginada(SchemaBaseTime).parse({
                data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },
        
        async obterPorId(id: number, relations?: FindOptionsRelations<Time>) {
            const time = await timeRepo.obterPorId(id, relations);
            if (!time) throw new AppError(404, 'Time não encontrado');
            return SchemaBaseTime.parse(time);
        },

        async criar(data: CriarTimeDTO) {
            const time = await timeRepo.criar(data);
            return SchemaBaseTime.parse(time);
        },

        async atualizar(id: number, data: AtualizarTimeDTO) {
            const time = await timeRepo.atualizar(id, data);
            if (!time) throw new AppError(404, 'Time não encontrado');
            return SchemaBaseTime.parse(time);
        },

        async deletar(id: number) {
            const deletado = await timeRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Time não encontrado');
            return deletado;
        },
    };
}
