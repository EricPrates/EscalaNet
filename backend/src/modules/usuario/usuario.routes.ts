import express from 'express';
import {usuarioController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obterUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);


export default (app: express.Application) => {
  app.use('/usuarios', router);
};