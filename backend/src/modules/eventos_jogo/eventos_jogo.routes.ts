import express from 'express';
import {eventoJogoController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';
const router = express.Router();



router.get('/', verificarPermissao('admin', 'professor'), eventoJogoController.listarEventos);
router.get('/:id', verificarPermissao('admin', 'professor'), eventoJogoController.obterEventoPorId);
router.post('/', verificarPermissao('admin', 'professor'), eventoJogoController.criarEvento);
router.put('/:id', verificarPermissao('admin', 'professor'), eventoJogoController.atualizarEvento);
router.delete('/:id', verificarPermissao('admin'), eventoJogoController.deletarEvento);


export default (app: express.Application) => {
  app.use('/eventos', router);
};