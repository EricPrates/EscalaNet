import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IFrequenciaService } from "./frequencia.interfaces";
import { CriarFrequenciaDTO } from "./frequencia.schemas";

export function fazerFrequenciaController(service: IFrequenciaService) {
    return {
        async listarFrequencias(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },

        async listarPorAluno(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const alunoId = Number(req.params.alunoId);
            const { data, meta } = await service.listarPorAluno(pagina, limite, alunoId);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },

        async listarPorTreino(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const treinoId = Number(req.params.treinoId);
            const { data, meta } = await service.listarPorTreino(pagina, limite, treinoId);
            return res.status(200).json(montarRespostaPaginada('Frequências listadas com sucesso', data, meta));
        },

        async obterFrequenciaPorId(req: Request, res: Response) {
            const f = await service.obterPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Frequência obtida com sucesso', f));
        },

        async criarFrequencia(req: Request, res: Response) {
            const data = req.body as CriarFrequenciaDTO;
            const f = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Frequência registrada com sucesso', f));
        },

        async atualizarFrequencia(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as Partial<CriarFrequenciaDTO>;
            const f = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Frequência atualizada com sucesso', f));
        },

        async deletarFrequencia(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Frequência deletada com sucesso'));
        },
    };
}
