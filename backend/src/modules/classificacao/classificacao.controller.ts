// classificacao.controller.ts
import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { IClassificacaoService } from "./classificacao.interfaces";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { QueryIncludesClassificacao, SchemaAtualizarClassificacao, SchemaBuscarPorIdClassificacao, SchemaCriarClassificacao, SchemaFiltrosClassificacao } from "./classificacao.schemas";
import { transformarIncludesEmRelations } from "../../shared/utils/query.schema";


export function fazerClassificacaoController(service: IClassificacaoService) {
    return {
       /* async obterClassificacao(req: Request, res: Response) {
            const { id } = req.params;
            
            const classificacao = await service.calcularClassificacao(
                Number(id)
            );
            
            return res.status(200).json(montarRespostaSucesso(
                'Classificação obtida com sucesso',
                classificacao
            ));
        }*/
       async listarClassificacoes(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtro = SchemaFiltrosClassificacao.parse(req.query);
            const { includes } = QueryIncludesClassificacao.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { data, meta } = await service.listar(pagina, limite, filtro, includesRelations);
            return res.status(200).json(montarRespostaPaginada('Classificações listadas com sucesso', data, meta));
        },

        async obterClassificacaoPorId(req: Request, res: Response) {
            const { includes } = QueryIncludesClassificacao.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const { id } = SchemaBuscarPorIdClassificacao.parse(req.params);
            const classificacao = await service.obterPorId(id, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Classificação obtida com sucesso', classificacao));
        },
        async obterClassificacaoPorFiltro(req: Request, res: Response) {
            const filtro = SchemaFiltrosClassificacao.parse(req.query);
            const { includes } = QueryIncludesClassificacao.parse(req.query);
            const includesRelations = transformarIncludesEmRelations(includes);
            const classificacao = await service.obterPorFiltro(filtro, includesRelations);
            return res.status(200).json(montarRespostaSucesso('Classificação obtida com sucesso', classificacao));
        },
        async criarClassificacao(req: Request, res: Response) {
            const data = SchemaCriarClassificacao.parse(req.body)
            const classificacao = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Classificação criada com sucesso', classificacao));
        },

        async atualizarClassificacao(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdClassificacao.parse(req.params);
            const data = SchemaAtualizarClassificacao.parse(req.body);
            const classificacao = await service.atualizar(id, data);
            return res.status(200).json(montarRespostaSucesso('Classificação atualizada com sucesso', classificacao));
        },
        
        
        async deletarClassificacao(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdClassificacao.parse(req.params);
            await service.deletar(id);
            return res.status(204).send();
        },
    };

}