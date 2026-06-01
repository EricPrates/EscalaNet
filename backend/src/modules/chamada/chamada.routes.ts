import express from 'express';
import {chamadasController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', chamadasController.listarChamadas);
router.get('/:id', chamadasController.obterChamadaPorId);
router.post('/', chamadasController.criarChamada);
router.put('/:id', chamadasController.atualizarChamada);
router.delete('/:id', chamadasController.deletarChamada);


export default (app: express.Application) => {
  app.use('/chamadas', router);
};