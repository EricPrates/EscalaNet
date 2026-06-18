import express from 'express';
import {treinoController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', treinoController.listarTreinos);
router.get('/:id', treinoController.obterTreinoPorId);
router.post('/', verificarPermissao('admin', 'professor'), treinoController.criarTreino);
router.put('/:id', verificarPermissao('admin', 'professor'), treinoController.atualizarTreino);
router.delete('/:id', verificarPermissao('admin', 'professor'), treinoController.deletarTreino);

export default (app: express.Application) => {
  app.use('/treinos', router);
};