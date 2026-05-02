import { Router } from 'express';
import {  usuarioController } from '../../shared/factory/container';
import {verificarPermissao} from '../../shared/Middlewares/verificarPermissao';
import { validate } from '../../shared/Middlewares/validadorSchema';
import { SchemaAtualizarUsuario, SchemaBaseUsuario } from './usuario.schemas';




const router = Router();



router.get(
    '/',verificarPermissao('admin'),
    usuarioController.listarUsuarios
);
router.get(
    '/pornucleo',verificarPermissao('coordenador'),
    usuarioController.listarPornucleoVinculado
);
router.get(
    '/:id',
    usuarioController.obterUsuarioPorId
);


router.post(
    '/',
    verificarPermissao('admin'),
     validate(SchemaBaseUsuario, 'body'),
    usuarioController.criarUsuario
);


router.put(
    '/:id',
    verificarPermissao('admin'),
    validate(SchemaAtualizarUsuario, 'body'),
    usuarioController.atualizarUsuario
);

router.delete(
    '/:id',
    verificarPermissao('admin'),
    usuarioController.deletarUsuario
);


export default router;