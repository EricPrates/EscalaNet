import express from 'express';
import {materialNucleoController} from '../../shared/factory/container';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';
const router = express.Router();

router.get('/', verificarPermissao('admin', 'professor'), materialNucleoController.listarMateriais);
router.get('/:id', verificarPermissao('admin', 'professor'), materialNucleoController.obterMaterialPorId);
router.post('/', verificarPermissao('admin', 'professor'), materialNucleoController.criarMaterial);
router.put('/:id', verificarPermissao('admin', 'professor'), materialNucleoController.atualizarMaterial);
router.delete('/:id', verificarPermissao('admin'), materialNucleoController.deletarMaterial);


export default (app: express.Application) => {
  app.use('/materiais', router);
};