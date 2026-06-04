import express from 'express';
import { relatorioController } from './relatorio.controller';

const router = express.Router();

/**
 * GET /relatorios/frequencia
 * Query params: nucleoId?, timeId?, jogadorId?, dataInicio?, dataFim?, tipo? (treino|jogo|todos)
 */
router.get('/frequencia', relatorioController.frequencia);

/**
 * GET /relatorios/desempenho
 * Query params: nucleoId?, timeId?, jogadorId?, jogoId?, competicaoId?, dataInicio?, dataFim?
 */
router.get('/desempenho', relatorioController.desempenho);

export default (app: express.Application) => {
    app.use('/relatorios', router);
};
