// src/shared/services/pdf.service.ts
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/AppError';

// Registra helpers para comparações nos templates
handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.registerHelper('gte', (a, b) => a >= b);
handlebars.registerHelper('lt', (a, b) => a < b);
handlebars.registerHelper('lte', (a, b) => a <= b);
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('and', (a, b) => a && b);
handlebars.registerHelper('or', (a, b) => a || b);

export class PDFService {
    private templateCache = new Map<string, HandlebarsTemplateDelegate>();

    /**
     * Gera um PDF a partir de um template Handlebars e dados.
     * @param templateName - Nome do arquivo .hbs (sem extensão)
     * @param data - Objeto com os dados para o template
     * @returns Buffer do PDF
     */
    async gerarPDF(templateName: string, data: any): Promise<Buffer> {
        try {
            // 1. Carrega o template (com cache)
            let templateFn = this.templateCache.get(templateName);
            if (!templateFn) {
                const templatePath = path.resolve(__dirname, '../templates', `${templateName}.hbs`);
                const templateContent = await fs.readFile(templatePath, 'utf-8');
                templateFn = handlebars.compile(templateContent);
                this.templateCache.set(templateName, templateFn);
                console.log(`[PDF] Template '${templateName}' carregado em cache`);
            }

            // 2. Renderiza o HTML
            const html = templateFn(data);

            // 3. Gera PDF com Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // recomendado para ambientes Linux
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'load' });

            await browser.close();
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true }) as Buffer;
            return pdfBuffer;
        } catch (error) {
            console.error('[PDF] Erro ao gerar PDF:', error);
            throw new AppError(500, 'Falha ao gerar o PDF');
        }
    }

    /**
     * Invalida o cache de um template específico (útil após editar o arquivo .hbs)
     */
    invalidarTemplate(templateName: string) {
        this.templateCache.delete(templateName);
        console.log(`[PDF] Cache do template '${templateName}' invalidado`);
    }

    /**
     * Limpa todo o cache de templates
     */
    limparCache() {
        this.templateCache.clear();
        console.log('[PDF] Cache de templates limpo');
    }
}