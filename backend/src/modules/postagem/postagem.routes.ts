import express from 'express';
import { postagemController } from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

// Rotas públicas — landing page (sem autenticação)
router.get('/', postagemController.listarPublicadas);
router.get('/:id', postagemController.obterPostagem);

// Rotas administrativas (requerem token — registradas após middlewareTokenContexto)
router.get('/', postagemController.listarPostagens);
router.post('/', verificarPermissao('admin', 'professor'), postagemController.criarPostagem);
router.put('/:id',verificarPermissao('admin', 'professor'), postagemController.atualizarPostagem);
router.delete('/:id',verificarPermissao('admin', 'professor'), postagemController.deletarPostagem);

export default (app: express.Application) => {
    app.use('/postagens', router);
};
