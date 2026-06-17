
import { AppError } from "../../shared/utils/AppError";
import { authStorage } from "../../shared/utils/authStorage";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IJogadorRepository, IJogadorService } from "./jogador.interfaces";
import { Jogador } from "./jogador.model";
import { CriarJogadorDTO, FiltrosJogadorDTO, RespostaResumidaJogadorDTO, SchemaJogadorDetalhado, SchemaJogadorResumido, RespostaJogadorDetalhadoDTO } from './jogador.schemas';
import { FindOptionsRelations } from 'typeorm';





export function fazerJogadorService(jogadorRepo: IJogadorRepository): IJogadorService {
    return {

        async listar(pagina: number, limite: number, where: FiltrosJogadorDTO, relations?: FindOptionsRelations<RespostaJogadorDetalhadoDTO>): Promise<{ data: RespostaJogadorDetalhadoDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }> {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await jogadorRepo.listar(pagina, limite, finalWhere, relations);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogadorDetalhado).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Jogador>): Promise<RespostaResumidaJogadorDTO> {
            const usuario = authStorage.getStore();
            const jogador = await jogadorRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!jogador) throw new AppError(404, 'Jogador não encontrado');
            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (jogador.nucleo && jogador.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            if (!jogador) throw new AppError(404, 'Jogador não encontrado');
            return SchemaJogadorDetalhado.parse(jogador);
        },

        async criar(data: CriarJogadorDTO): Promise<RespostaJogadorDetalhadoDTO> {
            const usuario = authStorage.getStore();
            if (usuario && usuario?.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                data.nucleo = { id: usuario.nucleoVinculadoId };
            } else if (!data.nucleo?.id) {
                throw new AppError(400, 'Núcleo é obrigatório');
            }
            const jogador = await jogadorRepo.criar(data);
            return SchemaJogadorDetalhado.parse(jogador);
        },

        async atualizar(id: number, data: Partial<CriarJogadorDTO>): Promise<RespostaResumidaJogadorDTO> {
            const usuario = authStorage.getStore();
            const verificarJogador = await jogadorRepo.obterPorId(id, { nucleo: true });
            if (!verificarJogador) throw new AppError(404, 'Jogador não encontrado');
            if (usuario && usuario?.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (verificarJogador.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a jogador fora do núcleo vinculado');
                }
            }
            const jogador = await jogadorRepo.atualizar(id, data);
            if (!jogador) throw new AppError(404, 'Jogador não encontrado');
            return SchemaJogadorResumido.parse(jogador);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore();
            const verificarJogador = await jogadorRepo.obterPorId(id, { nucleo: true });
            if (!verificarJogador) throw new AppError(404, 'Jogador não encontrado');
            if (usuario && usuario?.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (verificarJogador.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a jogador fora do núcleo vinculado');
                }
            }
            const deletado = await jogadorRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Jogador não encontrado');
            return deletado;
        },
    };
}
