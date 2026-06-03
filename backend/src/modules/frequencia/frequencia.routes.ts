import express from 'express';
import {frequenciaController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', frequenciaController.listarFrequencias);
router.get('/:id', frequenciaController.obterFrequenciaPorId);
router.post('/', frequenciaController.criarFrequencia);
router.put('/:id', frequenciaController.atualizarFrequencia);
router.delete('/:id', frequenciaController.deletarFrequencia);


export default (app: express.Application) => {
  app.use('/frequencias', router);
};