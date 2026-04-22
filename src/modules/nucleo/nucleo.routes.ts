import { Router } from 'express';
import { nucleoController } from '../../shared/factory/container';
import {verificarPermissao} from '../../shared/Middlewares/verificarPermissao';
import { validate } from '../../shared/Middlewares/validadorSchema';
import { SchemaAtualizarNucleo, SchemaBaseNucleo } from './nucleo.schemas';



const router = Router();



router.get(
    '/',verificarPermissao('admin'),
    nucleoController.listarNucleosComUsuariosVinculados
);

router.get(
    '/:id',
    nucleoController.obterNucleoPorId
);


router.post(
    '/',
    verificarPermissao('admin'),
     validate(SchemaBaseNucleo, 'body'),
    nucleoController.criarNucleo
);


router.put(
    '/:id',
    verificarPermissao('admin'),
    validate(SchemaAtualizarNucleo, 'body'),
    nucleoController.atualizarNucleo
);

router.delete(
    '/:id',
    verificarPermissao('admin'),
    nucleoController.deletarNucleo
);


export default router;