import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { CriarNucleoDTO, RespostaNucleoDTO } from "./nucleo.schemas";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IBaseService } from "../../shared/factory/BaseInterfaces";



export function fazerNucleoController(service: IBaseService<RespostaNucleoDTO, CriarNucleoDTO>) {
    return {
        async listarNucleosComUsuariosVinculados(req: Request, res: Response) {
            const {limite, pagina} = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Núcleos listados com sucesso', data, meta));
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

       
    };
}
