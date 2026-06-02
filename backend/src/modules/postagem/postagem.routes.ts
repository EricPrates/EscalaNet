// src/modules/postagem/postagem.routes.ts
import express from 'express';
import { postagemController } from '../../shared/factory/container';
import { fazerPostagemController } from './postagem.controller';

const router = express.Router();

// Rotas públicas (para landing page)
router.get('/publicadas', postagemController.listarPublicadas);
router.get('/:id', postagemController.obterPostagem);

// Rotas administrativas (protegidas por token)
router.post('/', postagemController.criarPostagem);
router.put('/:id', postagemController.atualizarPostagem);
router.delete('/:id', postagemController.deletarPostagem);

export default (app: express.Application) => {
    app.use('/postagens', router);
};