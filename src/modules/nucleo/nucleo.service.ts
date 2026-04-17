
import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { INucleoRepository, INucleoService } from "./nucleo.interfaces";
import { RespostaNucleoDTO, SchemaNucleoResposta, CriarNucleoDTO } from './nucleo.schemas';

export const fazerNucleoService = (nucleoRepo: INucleoRepository): INucleoService => {

    return {
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

        async listar(pagina: number, limite: number) {
            const { data, total } = await nucleoRepo.listar(pagina, limite);
            if (data.length === 0) {
                throw new AppError(404, 'Nenhum núcleo encontrado');
            }

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

        async criarNucleoSemRetorno(data: CriarNucleoDTO): Promise<void> {
            const verificaeNome = await nucleoRepo.obterPorNome(data.nome);
            if (verificaeNome) {
                throw new AppError(409, 'Núcleo já cadastrado');
            }
        
            await nucleoRepo.criarNucleoSemRetorno(data);            

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