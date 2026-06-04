import { Request, Response } from 'express';
import { montarRespostaSucesso } from '../../shared/utils/construtorResposta';
import {
    SchemaFiltrosRelatorioFrequencia,
    SchemaFiltrosRelatorioDesempenho,
    SchemaRelatorioFrequencia,
    SchemaRelatorioDesempenho,
} from './relatorio.schemas';
import { fazerRelatorioRepo } from './relatorio.repo';
import { AppDataSource } from '../../data-source';

const relatorioRepo = fazerRelatorioRepo(AppDataSource);

export const relatorioController = {
    async frequencia(req: Request, res: Response) {
        const filtros = SchemaFiltrosRelatorioFrequencia.parse(req.query);
        const relatorio = await relatorioRepo.frequencia(filtros);
        const validado = SchemaRelatorioFrequencia.parse(relatorio);
        return res.status(200).json(montarRespostaSucesso('Relatório de frequência gerado com sucesso', validado));
    },

    async desempenho(req: Request, res: Response) {
        const filtros = SchemaFiltrosRelatorioDesempenho.parse(req.query);
        const relatorio = await relatorioRepo.desempenho(filtros);
        const validado = SchemaRelatorioDesempenho.parse(relatorio);
        return res.status(200).json(montarRespostaSucesso('Relatório de desempenho gerado com sucesso', validado));
    },
};
