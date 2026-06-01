import express from 'express';
import {eventoJogoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', eventoJogoController.listarEventos);
router.get('/:id', eventoJogoController.obterEventoPorId);
router.post('/', eventoJogoController.criarEvento);
router.put('/:id', eventoJogoController.atualizarEvento);
router.delete('/:id', eventoJogoController.deletarEvento);


export default (app: express.Application) => {
  app.use('/eventos', router);
};