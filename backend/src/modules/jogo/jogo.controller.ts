import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IJogoService } from "./jogo.interfaces";
import { SchemaBaseJogo, SchemaBuscarPorIdJogo, SchemaAtualizarJogo, QueryIncludesJogo, SchemaFiltrosJogo } from "./jogo.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";

export function fazerJogoController(service: IJogoService) {
    return {
        async listarJogos(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosJogo.parse(req.query);
            const{includes} = QueryIncludesJogo.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Jogos listados com sucesso', data, meta));
        },

       
        async obterJogoPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesJogo.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdJogo.parse(req.params);
            const jogo = await service.obterPorId(id, includesRelations);
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
            return res.status(204).json(montarRespostaSucesso('Jogo deletado com sucesso'));
        },
    };
}
