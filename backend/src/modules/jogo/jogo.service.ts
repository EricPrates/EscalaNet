import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IJogoRepository, IJogoService } from "./jogo.interfaces";
import { CriarJogoDTO, RespostaJogoDTO, SchemaJogoResposta } from "./jogo.schemas";

export function fazerJogoService(jogoRepo: IJogoRepository): IJogoService {
    return {
        async listar(pagina: number, limite: number) {
        
            const { data, total } = await jogoRepo.listar(pagina, limite);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaJogoResposta).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },


        async obterPorId(id: number): Promise<RespostaJogoDTO> {
            const jogo = await jogoRepo.obterPorId(id);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return SchemaJogoResposta.parse(jogo);
        },

        async criar(data: CriarJogoDTO): Promise<RespostaJogoDTO> {
            if (data.timeA.id === data.timeB.id) throw new AppError(400, 'Time A e Time B não podem ser o mesmo núcleo');
            const jogo = await jogoRepo.criar(data);
            return SchemaJogoResposta.parse(jogo);
        },

        async atualizar(id: number, data: Partial<CriarJogoDTO>): Promise<RespostaJogoDTO> {
            const jogo = await jogoRepo.atualizar(id, data);
            if (!jogo) throw new AppError(404, 'Jogo não encontrado');
            return SchemaJogoResposta.parse(jogo);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await jogoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Jogo não encontrado');
            return deletado;
        },
    };
}
