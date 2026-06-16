import express from 'express';
import { classificacaoController } from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', verificarPermissao('admin', 'professor'), classificacaoController.listarClassificacoes);
router.get('/:id', verificarPermissao('admin', 'professor'), classificacaoController.obterClassificacaoPorId);
router.post('/', verificarPermissao('admin', 'professor'), classificacaoController.criarClassificacao);
router.put('/:id', verificarPermissao('admin', 'professor'), classificacaoController.atualizarClassificacao);
router.delete('/:id', verificarPermissao('admin'), classificacaoController.deletarClassificacao);

export default (app: express.Application) => {
  app.use('/classificacoes', router);
};