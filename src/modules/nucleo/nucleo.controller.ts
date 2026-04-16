import { Request, Response } from "express";
import { INucleoService } from "./nucleo.interfaces";
import { montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { CriarNucleoDTO } from "./nucleo.schemas";

export function fazerNucleoController(service: INucleoService) {
    return {
        async listarNucleos(_req: Request, res: Response) {
            const nucleos = await service.listar();
            return res.status(200).json(montarRespostaSucesso('Núcleos listados com sucesso', nucleos));
        },

        async obterNucleoPorId(req: Request, res: Response) {
            const { id } = req.params;
            const nucleo = await service.obterPorId(Number(id));
            return res.status(200).json(montarRespostaSucesso('Núcleo obtido com sucesso', nucleo));
        },

        async criarNucleo(req: Request, res: Response) {
            const data = req.body as CriarNucleoDTO;
            const nucleo = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Núcleo criado com sucesso', nucleo));
        },

        async atualizarNucleo(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as CriarNucleoDTO;
            const nucleo = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Núcleo atualizado com sucesso', nucleo));
        },
        
        async deletarNucleo(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Núcleo deletado com sucesso'));
        },

        async obterDashboard(req: Request, res: Response) {
            const { id } = req.params;
            const dashboard = await service.obterDadosDashboard(Number(id));
            return res.status(200).json(montarRespostaSucesso('Dashboard carregado com sucesso', dashboard));
        }
    };
}
