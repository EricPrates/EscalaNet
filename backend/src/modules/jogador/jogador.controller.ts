import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IJogadorService } from "./jogador.interfaces";
import { AtualizarJogadorDTO,  SchemaAtualizarJogador, SchemaBuscarPorIdJogador, SchemaCriarJogador, SchemaFiltrosJogador } from "./jogador.schemas";
import { getContext } from "../../shared/utils/authStorage";
import { AppError } from "../../shared/utils/AppError";


export function fazerJogadorController(service: IJogadorService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosJogador.parse(req.query);
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
            const { data, meta } = await service.listar(pagina, limite, filtros, includes);
            return res.status(200).json(montarRespostaPaginada('Jogadores listados com sucesso', data, meta));
        },

        async listarPorNucleoParaTreinador(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const nucleoId = getContext()!.nucleoVinculadoId;
            if (!nucleoId) throw new AppError(400, 'Núcleo não vinculado');
            const filtros = SchemaFiltrosJogador.parse( { nucleoId } );
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];

            const { data, meta } = await service.listar(pagina, limite, filtros, includes);
            return res.status(200).json(montarRespostaPaginada('Jogadores listados com sucesso', data, meta));
        },

        async obterJogadorPorId(req: Request, res: Response) {
            const {id} =SchemaBuscarPorIdJogador.parse(req.params);
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
        
            const jogador = await service.obterPorId(Number(id), includes);
            return res.status(200).json(montarRespostaSucesso('Jogador obtido com sucesso', jogador));
        },

        async criarJogador(req: Request, res: Response) {
            const data = SchemaCriarJogador.parse(req.body);
            const jogador = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Jogador criado com sucesso', jogador));
        },

        async atualizarJogador(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogador.parse(req.params);
            const data = SchemaAtualizarJogador.parse(req.body) as AtualizarJogadorDTO;
            const jogador = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Jogador atualizado com sucesso', jogador));
        },

        async deletarJogador(req: Request, res: Response) {
            const { id } = SchemaBuscarPorIdJogador.parse(req.params);
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Jogador deletado com sucesso'));
        },
    };
}
