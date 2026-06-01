import express from 'express';
import {jogoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', jogoController.listarJogos);
router.get('/:id', jogoController.obterJogoPorId);
router.post('/', jogoController.criarJogo);
router.put('/:id', jogoController.atualizarJogo);
router.delete('/:id', jogoController.deletarJogo);


export default (app: express.Application) => {
  app.use('/jogo', router);
};