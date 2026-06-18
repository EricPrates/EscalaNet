import express from 'express';
import {timeController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', timeController.listarTimes);
router.get('/:id', timeController.obterTimePorId);
router.post('/', verificarPermissao('admin', 'professor'), timeController.criarTime);
router.put('/:id', verificarPermissao('admin', 'professor'), timeController.atualizarTime);
router.delete('/:id', verificarPermissao('admin', 'professor'), timeController.deletarTime);

export default (app: express.Application) => {
  app.use('/times', router);
};