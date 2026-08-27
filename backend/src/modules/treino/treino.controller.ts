import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { ITreinoService } from "./treino.interfaces";
import { SchemaBaseTreino, SchemaAtualizarTreino, SchemaBuscarPorIdTreino, SchemaFiltrosTreino } from "./treino.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerTreinoController(service: ITreinoService) {
    return {
        async listarTreinos(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosTreino.parse(req.query);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Treinos listados com sucesso', data, meta));
        },


        async obterTreinoPorId(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdTreino.parse(req.params);
            const { includes } = req.query.includes ? { includes: (req.query.includes as string).split(',') } : { includes: [] };
            const includesRelations = transformarIncludesEmRelations(includes);
            const treino = await service.obterPorId(id, includesRelations);
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
            return res.status(204).json(montarRespostaSucesso('Treino deletado com sucesso'));
        },
        
    };
}
