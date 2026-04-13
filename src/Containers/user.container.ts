import { fazerUsuarioController } from "../Controllers/usuario.controller";
import { UsuarioRepo } from "../Repos/usuario.repo";
import { fazerUsuarioService } from "../Services/user.service";


const usuarioRepo = UsuarioRepo;
const usuarioService = fazerUsuarioService(usuarioRepo);
export const usuarioController = fazerUsuarioController(usuarioService);

