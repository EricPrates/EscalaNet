import express from 'express';
import {timeController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', timeController.listarTimes);
router.get('/:id', timeController.obterTimePorId);
router.post('/', timeController.criarTime);
router.put('/:id', timeController.atualizarTime);
router.delete('/:id', timeController.deletarTime);

export default (app: express.Application) => {
  app.use('/times', router);
};