
import { AppError } from "../../shared/utils/AppError";
import { getContext } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { INucleoRepository, INucleoService } from "./nucleo.interfaces";
import { RespostaNucleoDTO, SchemaNucleoResposta, CriarNucleoDTO } from './nucleo.schemas';

export const fazerNucleoService = (nucleoRepo: INucleoRepository): INucleoService => {

    return {
        async listar(pagina: number, limite: number) {
            const permissaoDoUsuarioLogado = getContext()?.permissao;
            let where = {};
            if (permissaoDoUsuarioLogado === 'coordenador' || permissaoDoUsuarioLogado === 'professor' || permissaoDoUsuarioLogado === 'auxiliar') {
                where = { nucleoVinculado: { id: getContext()?.nucleoVinculado || getContext()?.nucleosAdministrados } };
            }
            else if (permissaoDoUsuarioLogado === 'admin') {
                where = {};
            }

            const { data, total } = await nucleoRepo.listar(pagina, limite, where);
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
        async obterPorId(id: number): Promise<RespostaNucleoDTO> {
            const nucleo = await nucleoRepo.obterPorId(id);
            if (!nucleo) {
                throw new AppError(404, 'Núcleo não encontrado');
            }

            return SchemaNucleoResposta.parse(nucleo);
        },

        async criar(data: CriarNucleoDTO): Promise<RespostaNucleoDTO> {
            const nucleo = await nucleoRepo.criar(data);
            if (!nucleo) {
                throw new AppError(500, 'Erro ao criar núcleo');
            }
            return SchemaNucleoResposta.parse(nucleo);
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
        }
    }
}