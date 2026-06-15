import express from 'express';
import {chamadasController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/',verificarPermissao('admin'), chamadasController.listarChamadas);
router.get('/:id', verificarPermissao('admin', 'professor'), chamadasController.obterChamadaPorId);
router.post('/' , verificarPermissao('admin', 'professor'), chamadasController.criarChamada);
router.put('/:id', verificarPermissao('admin', 'professor'), chamadasController.atualizarChamada);
router.delete('/:id', verificarPermissao('admin'), chamadasController.deletarChamada);


export default (app: express.Application) => {
  app.use('/chamadas', router);
};