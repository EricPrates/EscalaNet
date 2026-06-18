// relatorio.routes.ts
import express from 'express';
import { relatorioController } from './relatorio.controller';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

// JSON endpoints
router.get('/frequencia', verificarPermissao('admin', 'professor'), relatorioController.frequencia);
router.get('/desempenho', verificarPermissao('admin', 'professor'), relatorioController.desempenho);

// ✅ PDF endpoints
router.get('/frequencia/pdf', verificarPermissao('admin', 'professor'), relatorioController.frequenciaPDF);
router.get('/desempenho/pdf', verificarPermissao('admin', 'professor'), relatorioController.desempenhoPDF);

export default (app: express.Application) => {
    app.use('/relatorios', router);
};