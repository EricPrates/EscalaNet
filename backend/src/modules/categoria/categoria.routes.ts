import express from 'express';
import { categoriaController } from '../../shared/factory/container';

const router = express.Router();

router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.obterCategoriaPorId);
router.post('/', categoriaController.criarCategoria);
router.put('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.deletarCategoria);


export default (app: express.Application) => {
  app.use('/categorias', router);
};