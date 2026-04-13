import { fazerUsuarioController } from "../Controllers/usuario.controller";
import { AppDataSource } from "../data-source";
import { fazerUsuarioRepo } from "../Repos/usuario.repo";
import { fazerUsuarioService } from "../Services/user.service";


const usuarioRepo = fazerUsuarioRepo(AppDataSource);
const usuarioService = fazerUsuarioService(usuarioRepo);
export const usuarioController = fazerUsuarioController(usuarioService);

