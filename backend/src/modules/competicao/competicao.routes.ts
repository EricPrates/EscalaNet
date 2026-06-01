import express from 'express';
import {competicaoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', competicaoController.listarCompeticoes);
router.get('/:id', competicaoController.obterCompeticaoPorId);
router.post('/', competicaoController.criarCompeticao);
router.put('/:id', competicaoController.atualizarCompeticao);
router.delete('/:id', competicaoController.deletarCompeticao);


export default (app: express.Application) => {
  app.use('/competicoes', router);
};