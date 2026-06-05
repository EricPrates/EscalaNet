import express from 'express';
import {competicaoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', competicaoController.listarCompeticoes);
router.get('/:id', competicaoController.obterCompeticaoPorId);
router.post('/', competicaoController.criarCompeticao);
router.post('/:id/gerar-jogos', competicaoController.gerarJogosCompeticao);
router.put('/:id/times', competicaoController.vincularTimesCompeticao);
router.post('/:id/recalcular-classificacao', competicaoController.recalcularClassificacao);
router.put('/:id', competicaoController.atualizarCompeticao);
router.delete('/:id', competicaoController.deletarCompeticao);


export default (app: express.Application) => {
  app.use('/competicoes', router);
};