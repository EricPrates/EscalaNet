import { fazerUsuarioController } from "../../modules/usuario/usuario.controller";
import { AppDataSource } from "../../data-source";
import { fazerUsuarioRepo } from "../../modules/usuario/usuario.repo";
import { fazerUsuarioService } from "../../modules/usuario/usuario.service";
import { fazerNucleoController } from "../../modules/nucleo/nucleo.controller";
import { fazerNucleoService } from "../../modules/nucleo/nucleo.service";
import { fazerNucleoRepo } from "../../modules/nucleo/nucleo.repo";
import { fazerAlunoService } from "../../modules/aluno/aluno.service";
import { fazerAlunoController } from "../../modules/aluno/aluno.controller";
import { fazerAlunoRepo } from "../../modules/aluno/aluno.repo";


const usuarioRepo = fazerUsuarioRepo(AppDataSource);
const usuarioService = fazerUsuarioService(usuarioRepo);
export const usuarioController = fazerUsuarioController(usuarioService);

const nucleoRepo = fazerNucleoRepo(AppDataSource);
const nucleoService = fazerNucleoService(nucleoRepo);
export const nucleoController = fazerNucleoController(nucleoService);


const alunoRepo = fazerAlunoRepo(AppDataSource);
const alunoService = fazerAlunoService(alunoRepo);
export const alunoController = fazerAlunoController(alunoService);