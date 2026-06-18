import express from 'express';
import {nucleoController} from '../../shared/factory/container';
import { verificarPermissao, verificarPermissaoProfessorNucleo } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

router.get('/', verificarPermissao('admin'), nucleoController.listarNucleos);
router.get('/:id/dashboard', verificarPermissao('admin', 'professor'), verificarPermissaoProfessorNucleo, nucleoController.obterDashboardNucleo);
router.get('/:id', verificarPermissao('admin', 'professor'), verificarPermissaoProfessorNucleo, nucleoController.obterNucleoPorId);
router.post('/', verificarPermissao('admin'), nucleoController.criarNucleo);
router.put('/:id', verificarPermissao('admin', 'professor'), verificarPermissaoProfessorNucleo, nucleoController.atualizarNucleo);
router.delete('/:id', verificarPermissao('admin'), nucleoController.deletarNucleo);

export default (app: express.Application) => {
  app.use('/nucleos', router);
};