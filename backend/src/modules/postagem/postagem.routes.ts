import express from 'express';
import { postagemController } from '../../shared/factory/container';

const router = express.Router();

// Rotas públicas — landing page (sem autenticação)
router.get('/publicadas', postagemController.listarPublicadas);
router.get('/:id', postagemController.obterPostagem);

// Rotas administrativas (requerem token — registradas após middlewareTokenContexto)
router.get('/', postagemController.listarPostagens);
router.post('/', postagemController.criarPostagem);
router.put('/:id', postagemController.atualizarPostagem);
router.delete('/:id', postagemController.deletarPostagem);

export default (app: express.Application) => {
    app.use('/postagens', router);
};
