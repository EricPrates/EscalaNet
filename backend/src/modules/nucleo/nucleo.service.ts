
import { AppError } from "../../shared/utils/AppError";
import { authStorage, getContext } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { INucleoRepository, INucleoService } from "./nucleo.interfaces";
import { Nucleo } from "./Nucleo.model";
import { RespostaNucleoDTO, SchemaNucleoResposta, CriarNucleoDTO, DashboardNucleoDTO, SchemaDashboardNucleo } from './nucleo.schemas';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';


export const fazerNucleoService = (nucleoRepo: INucleoRepository): INucleoService => {

    return {
        //apenas admin pode listar todos os núcleos, os outros só podem buscar o seu núcleo vinculado
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Nucleo>, relations?: FindOptionsRelations<Nucleo>) {
            const { data, total } = await nucleoRepo.listar(pagina, limite, where, relations);
            const dataValidada = SchemaNucleoResposta.array().parse(data);
            const totalPaginas = Math.ceil(total / limite);

            return SchemaRespostaPaginada(SchemaNucleoResposta).parse({
                data: dataValidada,
                meta: {
                    pagina: pagina,
                    limite: limite,
                    total: total,
                    totalPaginas: totalPaginas
                }
            });
        },

        async obterPorNome(nome: string): Promise<RespostaNucleoDTO> {

            const nucleo = await nucleoRepo.obterPorNome(nome);
            if (!nucleo) {
                throw new AppError(404, 'Núcleo não encontrado');
            }
            return SchemaNucleoResposta.parse(nucleo);
        },
        async obterPorId(id: number, relations?: FindOptionsRelations<Nucleo>): Promise<RespostaNucleoDTO> {
            const usuario = authStorage.getStore();
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            const nucleo = await nucleoRepo.obterPorId(id, relations);
            if (!nucleo) throw new AppError(404, 'Núcleo não encontrado');
            return SchemaNucleoResposta.parse(nucleo);
        },

        async criar(data: CriarNucleoDTO): Promise<RespostaNucleoDTO> {
            const nucleo = await nucleoRepo.criar(data);
            const respostaDTO: RespostaNucleoDTO = SchemaNucleoResposta.parse(nucleo);
            return respostaDTO;
        },



        async atualizar(id: number, data: CriarNucleoDTO): Promise<RespostaNucleoDTO> {
            const nucleo = await nucleoRepo.atualizar(id, data);
            if (!nucleo) {
                throw new AppError(404, 'Núcleo não encontrado');
            }
            const respostaDTO: RespostaNucleoDTO = SchemaNucleoResposta.parse(nucleo);
            return respostaDTO;
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await nucleoRepo.deletar(id);
            if (!deletado) {
                throw new AppError(404, 'Núcleo não encontrado');
            }
            return deletado;
        },

        async obterDashboard(nucleoId: number): Promise<DashboardNucleoDTO> {
            const permissao = getContext()?.permissao;
            if (permissao !== 'admin') {
                const nucleoVinculadoId = getContext()?.nucleoVinculadoId;
                if (!nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: usuário sem núcleo vinculado');
                }
                if (nucleoVinculadoId !== nucleoId) {
                    throw new AppError(403, 'Acesso negado: só é permitido acessar o dashboard do seu núcleo');
                }
            }
            const nucleo = await nucleoRepo.obterPorId(nucleoId);
            if (!nucleo) throw new AppError(404, 'Núcleo não encontrado');

            const dashboard = await nucleoRepo.obterDashboard(nucleoId);
            return SchemaDashboardNucleo.parse(dashboard);
        },
    }
}