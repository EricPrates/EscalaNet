import express from 'express';
import {materialNucleoController} from '../../shared/factory/container';

const router = express.Router();

router.get('/', materialNucleoController.listarMateriais);
router.get('/:id', materialNucleoController.obterMaterialPorId);
router.post('/', materialNucleoController.criarMaterial);
router.put('/:id', materialNucleoController.atualizarMaterial);
router.delete('/:id', materialNucleoController.deletarMaterial);


export default (app: express.Application) => {
  app.use('/material-nucleo', router);
};