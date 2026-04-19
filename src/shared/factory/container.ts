import { AppDataSource } from "../../data-source";

// Usuario
import { fazerUsuarioRepo } from "../../modules/usuario/usuario.repo";
import { fazerUsuarioService } from "../../modules/usuario/usuario.service";
import { fazerUsuarioController } from "../../modules/usuario/usuario.controller";

// Nucleo
import { fazerNucleoRepo } from "../../modules/nucleo/nucleo.repo";
import { fazerNucleoService } from "../../modules/nucleo/nucleo.service";
import { fazerNucleoController } from "../../modules/nucleo/nucleo.controller";

// Categoria
import { fazerCategoriaRepo } from "../../modules/categoria/categoria.repo";
import { fazerCategoriaService } from "../../modules/categoria/categoria.service";
import { fazerCategoriaController } from "../../modules/categoria/categoria.controller";

// Aluno
import { fazerAlunoRepo } from "../../modules/aluno/aluno.repo";
import { fazerAlunoService } from "../../modules/aluno/aluno.service";
import { fazerAlunoController } from "../../modules/aluno/aluno.controller";

// Treino
import { fazerTreinoRepo } from "../../modules/treino/treino.repo";
import { fazerTreinoService } from "../../modules/treino/treino.service";
import { fazerTreinoController } from "../../modules/treino/treino.controller";

// Jogo
import { fazerJogoRepo } from "../../modules/jogo/jogo.repo";
import { fazerJogoService } from "../../modules/jogo/jogo.service";
import { fazerJogoController } from "../../modules/jogo/jogo.controller";

// Frequencia
import { fazerFrequenciaRepo } from "../../modules/frequencia/frequencia.repo";
import { fazerFrequenciaService } from "../../modules/frequencia/frequencia.service";
import { fazerFrequenciaController } from "../../modules/frequencia/frequencia.controller";

// EventosJogo
import { fazerEventoJogoRepo } from "../../modules/eventos_jogo/eventos_jogo.repo";
import { fazerEventoJogoService } from "../../modules/eventos_jogo/eventos_jogo.service";
import { fazerEventoJogoController } from "../../modules/eventos_jogo/eventos_jogo.controller";

// --- Instâncias ---

const usuarioRepo = fazerUsuarioRepo(AppDataSource);
const usuarioService = fazerUsuarioService(usuarioRepo);
export const usuarioController = fazerUsuarioController(usuarioService);

const nucleoRepo = fazerNucleoRepo(AppDataSource);
const nucleoService = fazerNucleoService(nucleoRepo);
export const nucleoController = fazerNucleoController(nucleoService);

const categoriaRepo = fazerCategoriaRepo(AppDataSource);
const categoriaService = fazerCategoriaService(categoriaRepo);
export const categoriaController = fazerCategoriaController(categoriaService);

const alunoRepo = fazerAlunoRepo(AppDataSource);
const alunoService = fazerAlunoService(alunoRepo);
export const alunoController = fazerAlunoController(alunoService);

const treinoRepo = fazerTreinoRepo(AppDataSource);
const treinoService = fazerTreinoService(treinoRepo);
export const treinoController = fazerTreinoController(treinoService);

const jogoRepo = fazerJogoRepo(AppDataSource);
const jogoService = fazerJogoService(jogoRepo);
export const jogoController = fazerJogoController(jogoService);

const frequenciaRepo = fazerFrequenciaRepo(AppDataSource);
const frequenciaService = fazerFrequenciaService(frequenciaRepo);
export const frequenciaController = fazerFrequenciaController(frequenciaService);

const eventoJogoRepo = fazerEventoJogoRepo(AppDataSource);
const eventoJogoService = fazerEventoJogoService(eventoJogoRepo);
export const eventoJogoController = fazerEventoJogoController(eventoJogoService);
