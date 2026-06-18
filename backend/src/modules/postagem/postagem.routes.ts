import express from 'express';
import { postagemController } from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const routerPublic = express.Router();
const routerProtected = express.Router();

// Rotas públicas (landing page)
routerPublic.get('/', postagemController.listarPublicadas);
routerPublic.get('/:id', postagemController.obterPostagemPorId);

// Rotas protegidas (admin)
routerProtected.use(verificarPermissao('admin'));
routerProtected.post('/', postagemController.criarPostagem);
routerProtected.put('/:id', postagemController.atualizarPostagem);
routerProtected.delete('/:id', postagemController.deletarPostagem);

export { routerPublic, routerProtected };

export default routerPublic;