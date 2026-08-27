import express from 'express';
import { fazerDash } from './dash.controller';

import { AppDataSource } from '../../../data-source';

const router = express.Router();

const controller = fazerDash(AppDataSource);

router.get('/frequencia/total', (req, res) => controller.frequenciaTotalContagem(req, res));
router.get('/frequencia/por-nucleo', (req, res) => controller.frequenciaPorNucleo(req, res));
router.get('/frequencia/por-jogador', (req, res) => controller.frequenciaPorJogador(req, res));
router.get('/frequencia/por-treino', (req, res) => controller.frequenciaPorTreino(req, res));
router.get('/jogadores/contagem', (req, res) => controller.contagemDeJogadores(req, res));
router.get('/nucleos/contagem', (req, res) => controller.contagemdeNucleos(req, res));
router.get('/jogos/agendados', (req, res) => controller.jogosAgendados(req, res));
router.get('/frequencias/por-data', (req, res) => controller.frequenciasPorData(req, res));
router.get('/jogadores/cadastrados-hoje', (req, res) => controller.jogadoresCadastradosHoje(req, res));
router.get('/times/contagem', (req, res) => controller.contagemDeTimes(req, res));
router.get('/nucleos/:id/usuarios/contagem', (req, res) => controller.contagemDeUsuariosPorNucleo(req, res));
router.get('/nucleos/:id/jogadores/contagem', (req, res) => controller.contagemDeJogadoresPorNucleo(req, res));
export default (app: express.Application) => {
  app.use('/dash', router);
}