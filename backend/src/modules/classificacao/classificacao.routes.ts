import express from 'express';
import { classificacaoController } from '../../shared/factory/container';

const router = express.Router();

router.get('/', classificacaoController.listarClassificacoes);
router.get('/:id', classificacaoController.obterClassificacaoPorId);
router.post('/', classificacaoController.criarClassificacao);
router.put('/:id', classificacaoController.atualizarClassificacao);
router.delete('/:id', classificacaoController.deletarClassificacao);

export default (app: express.Application) => {
  app.use('/classificacoes', router);
};