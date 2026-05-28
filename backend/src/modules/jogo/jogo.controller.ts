import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IJogoService } from "./jogo.interfaces";
import { SchemaBaseJogo, SchemaBuscarPorIdJogo, SchemaBuscarPorNucleo, SchemaBuscarPorCategoria, SchemaAtualizarJogo } from "./jogo.schemas";

export function fazerJogoController(service: IJogoService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async listarPorNucleo(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { nucleoId } = SchemaBuscarPorNucleo.parse(req.params);
            const { data, meta } = await service.listarPorNucleo(pagina, limite, nucleoId);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async listarPorCategoria(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { categoriaId } = SchemaBuscarPorCategoria.parse(req.params);
            const { data, meta } = await service.listarPorCategoria(pagina, limite, categoriaId);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

        async obterJogoPorId(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogo.parse(req.params);
            const jogo = await service.obterPorId(id);
            return res.status(200).json(montarRespostaSucesso('Jogo obtido com sucesso', jogo));
        },

        async criarJogo(req: Request, res: Response) {
            const data = SchemaBaseJogo.parse(req.body);
            const jogo = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Jogo criado com sucesso', jogo));
        },

        async atualizarJogo(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogo.parse(req.params);
            const data = SchemaAtualizarJogo.parse(req.body);
            const jogo = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Jogo atualizado com sucesso', jogo));
        },

        async deletarJogo(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogo.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };
}
