import express from 'express';
import {frequenciaController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', verificarPermissao('admin', 'professor'), frequenciaController.listarFrequencias);
router.get('/:id', verificarPermissao('admin', 'professor'), frequenciaController.obterFrequenciaPorId);
router.post('/', verificarPermissao('admin', 'professor'), frequenciaController.criarFrequencia);
router.put('/:id', verificarPermissao('admin', 'professor'), frequenciaController.atualizarFrequencia);
router.delete('/:id', verificarPermissao('admin'), frequenciaController.deletarFrequencia);


export default (app: express.Application) => {
  app.use('/frequencias', router);
};