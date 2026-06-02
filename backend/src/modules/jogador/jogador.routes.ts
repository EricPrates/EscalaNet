import express from 'express';
import {jogadorController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', jogadorController.listarJogadores);
router.get('/:id', jogadorController.obterJogadorPorId);
router.get('/', jogadorController.obterJogadoresPorFiltro);
router.post('/', jogadorController.criarJogador);
router.put('/:id', jogadorController.atualizarJogador);
router.delete('/:id', jogadorController.deletarJogador);


export default (app: express.Application) => {
  app.use('/jogadores', router);
};