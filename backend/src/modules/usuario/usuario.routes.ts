import express from 'express';
import {usuarioController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', verificarPermissao('admin', 'professor'), usuarioController.listarUsuarios);
router.get('/:id', verificarPermissao('admin', 'professor'), usuarioController.obterUsuarioPorId);
router.post('/', verificarPermissao('admin'), usuarioController.criarUsuario);
router.put('/:id', verificarPermissao('admin'), usuarioController.atualizarUsuario);
router.delete('/:id', verificarPermissao('admin'), usuarioController.deletarUsuario);


export default (app: express.Application) => {
  app.use('/usuarios', router);
};