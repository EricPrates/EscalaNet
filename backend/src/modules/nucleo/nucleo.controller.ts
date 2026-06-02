import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { CriarNucleoDTO, RespostaNucleoDTO, SchemaBaseNucleo, SchemaIdNUcleo, SchemaAtualizarNucleo } from "./nucleo.schemas";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IBaseService } from "../../shared/factory/BaseInterfaces";



export function fazerNucleoController(service: IBaseService<RespostaNucleoDTO, CriarNucleoDTO, CriarNucleoDTO>) {
    return {
        async listarNucleos(req: Request, res: Response) {
            const {limite, pagina} = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Núcleos listados com sucesso', data, meta));
        },

        async obterNucleoPorId(req: Request, res: Response) {
            const { id } = SchemaIdNUcleo.parse(req.params);
            const nucleo = await service.obterPorId(id);
            return res.status(200).json(montarRespostaSucesso('Núcleo obtido com sucesso', nucleo));
        },

        async criarNucleo(req: Request, res: Response) {
            const data = SchemaBaseNucleo.parse(req.body);
            const nucleo = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Núcleo criado com sucesso', nucleo));
        },

        async atualizarNucleo(req: Request, res: Response) {
            const { id } = SchemaIdNUcleo.parse(req.params);
            const data = SchemaAtualizarNucleo.parse(req.body);
            const nucleo = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Núcleo atualizado com sucesso', nucleo));
        },

        async deletarNucleo(req: Request, res: Response) {
            const { id } = SchemaIdNUcleo.parse(req.params);
            await service.deletar(id);
            return res.status(204).json(montarRespostaSucesso('Núcleo deletado com sucesso'));
        },

       
    };
}
