import { fazerUsuarioController } from "./usuario.controller";
import { AppDataSource } from "../../data-source";
import { fazerUsuarioRepo } from "./usuario.repo";
import { fazerUsuarioService } from "./usuario.service";


const usuarioRepo = fazerUsuarioRepo(AppDataSource);
const usuarioService = fazerUsuarioService(usuarioRepo);
export const usuarioController = fazerUsuarioController(usuarioService);

