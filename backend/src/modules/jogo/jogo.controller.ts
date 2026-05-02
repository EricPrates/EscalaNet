import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IJogoService } from "./jogo.interfaces";
import { CriarJogoDTO } from "./jogo.schemas";

export function fazerJogoController(service: IJogoService) {
    return {
        async listarJogos(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async listarPorNucleo(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const nucleoId = Number(req.params.nucleoId);
            const { data, meta } = await service.listarPorNucleo(pagina, limite, nucleoId);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async listarPorCategoria(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const categoriaId = Number(req.params.categoriaId);
            const { data, meta } = await service.listarPorCategoria(pagina, limite, categoriaId);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async obterJogoPorId(req: Request, res: Response) {
            const jogo = await service.obterPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Jogo obtido com sucesso', jogo));
        },

        async criarJogo(req: Request, res: Response) {
            const data = req.body as CriarJogoDTO;
            const jogo = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Jogo criado com sucesso', jogo));
        },

        async atualizarJogo(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as Partial<CriarJogoDTO>;
            const jogo = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Jogo atualizado com sucesso', jogo));
        },

        async deletarJogo(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Jogo deletado com sucesso'));
        },
    };
}
