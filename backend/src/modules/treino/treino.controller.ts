import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ITreinoService } from "./treino.interfaces";
import { SchemaBaseTreino, SchemaAtualizarTreino, SchemaBuscarPorIdTreino, SchemaBuscarPorNucleo } from "./treino.schemas";

export function fazerTreinoController(service: ITreinoService) {
    return {
        async listarTreinos(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Treinos listados com sucesso', data, meta));
        },

        async listarPorNucleo(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const { nucleoId } = SchemaBuscarPorNucleo.parse(req.params);
            const { data, meta } = await service.listarPorNucleo(pagina, limite, nucleoId);
            return res.status(200).json(montarRespostaPaginada('Treinos listados com sucesso', data, meta));
        },

        async obterTreinoPorId(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTreino.parse(req.params);
            const treino = await service.obterPorId(id);
            return res.status(200).json(montarRespostaSucesso('Treino obtido com sucesso', treino));
        },

        async criarTreino(req: Request, res: Response) {
            const data = SchemaBaseTreino.parse(req.body);
            const treino = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Treino criado com sucesso', treino));
        },

        async atualizarTreino(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTreino.parse(req.params);
            const data = SchemaAtualizarTreino.parse(req.body);
            const treino = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Treino atualizado com sucesso', treino));
        },

        async deletarTreino(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTreino.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };
}
