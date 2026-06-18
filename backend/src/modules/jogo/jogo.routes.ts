import express from 'express';
import {jogoController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', jogoController.listarJogos);
router.get('/:id', jogoController.obterJogoPorId);
router.post('/', verificarPermissao('admin', 'professor'), jogoController.criarJogo);
router.put('/:id',verificarPermissao('admin', 'professor'), jogoController.atualizarJogo);
router.delete('/:id', verificarPermissao('admin', 'professor'), jogoController.deletarJogo);


export default (app: express.Application) => {
  app.use('/jogos', router);
};