import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IJogadorRepository, IJogadorService } from "./jogador.interfaces";
import { CriarJogadorDTO, FiltrosJogadorDTO, RespostaResumidaJogadorDTO, SchemaJogadorDetalhado, SchemaJogadorResumido, RespostaJogadorDetalhadoDTO } from './jogador.schemas';
import { FindOptionsRelations } from 'typeorm';





export function fazerJogadorService(jogadorRepo: IJogadorRepository): IJogadorService {
    return {

        async listar(pagina: number, limite: number, where: FiltrosJogadorDTO, relations?: FindOptionsRelations<RespostaJogadorDetalhadoDTO>): Promise<{ data: RespostaJogadorDetalhadoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleos: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await jogadorRepo.listar(pagina, limite, finalWhere, relations);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogadorDetalhado).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<RespostaJogadorDetalhadoDTO>): Promise<RespostaResumidaJogadorDTO> {
            const usuario = authStorage.getStore();
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            const jogador = await jogadorRepo.obterPorId(id, relations);
            if (!jogador) throw new AppError(404, 'Jogador não encontrado');
            return SchemaJogadorDetalhado.parse(jogador);
        },

        async criar(data: CriarJogadorDTO): Promise<RespostaJogadorDetalhadoDTO> {

            const jogador = await jogadorRepo.criar(data);
            return SchemaJogadorDetalhado.parse(jogador);
        },

        async atualizar(id: number, data: Partial<CriarJogadorDTO>): Promise<RespostaResumidaJogadorDTO> {
            const jogador = await jogadorRepo.atualizar(id, data);
            if (!jogador) throw new AppError(404, 'Jogador não encontrado');
            return SchemaJogadorResumido.parse(jogador);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await jogadorRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Jogador não encontrado');
            return deletado;
        },
    };
}
