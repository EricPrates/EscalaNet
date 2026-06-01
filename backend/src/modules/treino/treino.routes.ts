import express from 'express';
import {treinoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', treinoController.listarTreinos);
router.get('/:id', treinoController.obterTreinoPorId);
router.post('/', treinoController.criarTreino);
router.put('/:id', treinoController.atualizarTreino);
router.delete('/:id', treinoController.deletarTreino);

export default (app: express.Application) => {
  app.use('/treinos', router);
};