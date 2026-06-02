import express from 'express';
import { categoriaController } from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.obterCategoriaPorId);
router.post('/',verificarPermissao('admin'), categoriaController.criarCategoria);
router.put('/:id', verificarPermissao('admin'), categoriaController.atualizarCategoria);
router.delete('/:id', verificarPermissao('admin'), categoriaController.deletarCategoria);


export default (app: express.Application) => {
  app.use('/categorias', router);
};