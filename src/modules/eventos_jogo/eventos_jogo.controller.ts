import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IEventoJogoService } from "./eventos_jogo.interfaces";
import { CriarEventoJogoDTO } from "./eventos_jogo.schemas";

export function fazerEventoJogoController(service: IEventoJogoService) {
    return {
        async listarEventos(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Eventos listados com sucesso', data, meta));
        },

        async listarPorJogo(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const jogoId = Number(req.params.jogoId);
            const { data, meta } = await service.listarPorJogo(pagina, limite, jogoId);
            return res.status(200).json(montarRespostaPaginada('Eventos listados com sucesso', data, meta));
        },

        async obterEventoPorId(req: Request, res: Response) {
            const e = await service.obterPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Evento obtido com sucesso', e));
        },

        async criarEvento(req: Request, res: Response) {
            const data = req.body as CriarEventoJogoDTO;
            const e = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Evento registrado com sucesso', e));
        },

        async atualizarEvento(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as Partial<CriarEventoJogoDTO>;
            const e = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Evento atualizado com sucesso', e));
        },

        async deletarEvento(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Evento deletado com sucesso'));
        },
    };
}
