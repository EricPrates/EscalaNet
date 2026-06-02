import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IJogadorService } from "./jogador.interfaces";
import { QueryIncludesJogador,  SchemaAtualizarJogador, SchemaBuscarPorIdJogador, SchemaCriarJogador, SchemaFiltrosJogador } from "./jogador.schemas";
import { getContext } from "../../shared/utils/authStorage";
import { AppError } from "../../shared/utils/AppError";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";


export function fazerJogadorController(service: IJogadorService) {
    return {
        async listarJogadores(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosJogador.parse(req.query);
            const { includes } = QueryIncludesJogador.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Jogadores listados com sucesso', data, meta));
        },
        async obterJogadoresPorFiltro(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosJogador.parse(req.query);
            const { includes } = QueryIncludesJogador.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.obterPorFiltros(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Jogadores listados com sucesso', data, meta));
        },
        async listarPorNucleoParaTreinador(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const nucleoId = getContext()!.nucleoVinculadoId;
            if (!nucleoId) throw new AppError(400, 'Núcleo não vinculado');
            const filtros = SchemaFiltrosJogador.parse( { nucleoId } );
            const { includes } = QueryIncludesJogador.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);

            const { data, meta } = await service.listar(pagina, limite, filtros, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Jogadores listados com sucesso', data, meta));
        },

        async obterJogadorPorId(req: Request, res: Response) {
            const {id} =SchemaBuscarPorIdJogador.parse(req.params);
            const { includes } = QueryIncludesJogador.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
        
            const jogador = await service.obterPorId(Number(id), includesRelations);
            return res.status(200).json(montarRespostaSucesso('Jogador obtido com sucesso', jogador));
        },

        async criarJogador(req: Request, res: Response) {
            const data = SchemaCriarJogador.parse(req.body);
            const jogador = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Jogador criado com sucesso', jogador));
        },

        async atualizarJogador(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogador.parse(req.params);
            const data = SchemaAtualizarJogador.parse(req.body);
            const jogador = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Jogador atualizado com sucesso', jogador));
        },

        async deletarJogador(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogador.parse(req.params);
            await service.deletar(Number(id));
            return res.status(204).json(montarRespostaSucesso('Jogador deletado com sucesso'));
        },
    };
}
