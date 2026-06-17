import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { ITreinoRepository, ITreinoService } from "./treino.interfaces";
import { CriarTreinoDTO, RespostaTreinoDTO, SchemaTreinoResposta } from "./treino.schemas";
import { FindOptionsWhere, FindOptionsRelations } from 'typeorm';



export function fazerTreinoService(treinoRepo: ITreinoRepository): ITreinoService {
    return {

        async listar(pagina: number, limite: number, where:FindOptionsWhere<RespostaTreinoDTO>, relations?: FindOptionsRelations<RespostaTreinoDTO>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await treinoRepo.listar(pagina, limite, finalWhere, relations);
           
         
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaTreinoResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },
       

        async obterPorId(id: number): Promise<RespostaTreinoDTO> {

            const usuario = authStorage.getStore();
            const treino = await treinoRepo.obterPorId(id);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (treino.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a treino fora do núcleo vinculado');
                }
            }
            return SchemaTreinoResposta.parse(treino);
        },

        async criar(data: CriarTreinoDTO): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.criar(data);
            return SchemaTreinoResposta.parse(treino);
        },

        async atualizar(id: number, data: CriarTreinoDTO): Promise<RespostaTreinoDTO> {
            const treino = await treinoRepo.atualizar(id, data);
            if (!treino) throw new AppError(404, 'Treino não encontrado');
            return SchemaTreinoResposta.parse(treino);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await treinoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Treino não encontrado');
            return deletado;
        },
    };
}
