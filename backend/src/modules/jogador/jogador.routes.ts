import express from 'express';
import {jogadorController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/',  jogadorController.listarJogadores);
router.get('/:id', jogadorController.obterJogadorPorId);

router.post('/', verificarPermissao('admin', 'professor'), jogadorController.criarJogador);
router.put('/:id', verificarPermissao('admin', 'professor'), jogadorController.atualizarJogador);
router.delete('/:id', verificarPermissao('admin', 'professor'), jogadorController.deletarJogador);


export default (app: express.Application) => {
  app.use('/jogadores', router);
};