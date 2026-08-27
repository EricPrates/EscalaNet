import { Request, Response } from 'express';
import { montarRespostaSucesso } from '../../shared/utils/construtorResposta';
import {
    SchemaFiltrosRelatorioFrequencia,
    SchemaFiltrosRelatorioDesempenho,
    SchemaRelatorioFrequencia,
    SchemaRelatorioDesempenho,
} from './relatorio.schemas';
import { fazerRelatorioRepo } from './relatorio.repo';
import { AppDataSource } from '../../../data-source';
import { PDFService } from '../../shared/servicosExternos/pdf.service';

const relatorioRepo = fazerRelatorioRepo(AppDataSource);
    const pdfService = new PDFService();
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
    async frequenciaPDF(req: Request, res: Response) {
        const filtros = SchemaFiltrosRelatorioFrequencia.parse(req.query);
        const relatorio = await relatorioRepo.frequencia(filtros);
        const validado = SchemaRelatorioFrequencia.parse(relatorio);

        // Adiciona data de geração para o template
        const dadosTemplate = {
            ...validado,
            dataGeracao: new Date().toLocaleString('pt-BR'),
            // Handlebars precisa de helpers para comparações
            // Você pode registrar helpers globais ou usar diretamente
        };

        const pdfBuffer = await pdfService.gerarPDF('relatorioFrequencia', dadosTemplate);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio-frequencia-${Date.now()}.pdf"`);
        res.send(pdfBuffer);
    },

    async desempenhoPDF(req: Request, res: Response) {
        const filtros = SchemaFiltrosRelatorioDesempenho.parse(req.query);
        const relatorio = await relatorioRepo.desempenho(filtros);
        const validado = SchemaRelatorioDesempenho.parse(relatorio);

        const dadosTemplate = {
            ...validado,
            dataGeracao: new Date().toLocaleString('pt-BR'),
        };

        const pdfBuffer = await pdfService.gerarPDF('relatorioDesempenho', dadosTemplate);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio-desempenho-${Date.now()}.pdf"`);
        res.send(pdfBuffer);
    },

};
