import express from 'express';
import {nucleoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', nucleoController.listarNucleos);
router.get('/:id', nucleoController.obterNucleoPorId);
router.post('/', nucleoController.criarNucleo);
router.put('/:id', nucleoController.atualizarNucleo);
router.delete('/:id', nucleoController.deletarNucleo);

export default (app: express.Application) => {
  app.use('/nucleos', router);
};