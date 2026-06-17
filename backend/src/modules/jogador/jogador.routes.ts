import express from 'express';
import {jogadorController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', verificarPermissao('admin', 'professor'), jogadorController.listarJogadores);
router.get('/:id', verificarPermissao('admin', 'professor'), jogadorController.obterJogadorPorId);

router.post('/', jogadorController.criarJogador);
router.put('/:id', jogadorController.atualizarJogador);
router.delete('/:id', jogadorController.deletarJogador);


export default (app: express.Application) => {
  app.use('/jogadores', router);
};