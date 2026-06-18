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

// Jogador
import { fazerJogadorRepo } from "../../modules/jogador/jogador.repo";
import { fazerJogadorService } from "../../modules/jogador/jogador.service";
import { fazerJogadorController } from "../../modules/jogador/jogador.controller";

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
// Chamadas
import { fazerChamadaRepo } from "../../modules/chamada/chamada.repo";
import { fazerChamadaService } from "../../modules/chamada/chamada.service";
import { fazerChamadaController } from "../../modules/chamada/chamada.controller";
// Classificação
import { fazerClassificacaoRepo } from "../../modules/classificacao/classificacao.repo";
import { fazerClassificacaoService } from "../../modules/classificacao/classificacao.service";
import { fazerClassificacaoController } from "../../modules/classificacao/classificacao.controller";

// Competição
import { fazerCompeticaoController } from "../../modules/competicao/competicao.controller";
import {fazerCompeticaoService} from "../../modules/competicao/competicao.service";
import {fazerCompeticaoRepo} from "../../modules/competicao/competicao.repo";

//Material Núcleo
import { fazerMaterialNucleoController } from "../../modules/material/material.controller";
import { fazerMaterialNucleoService } from "../../modules/material/material.service";
import { fazerMaterialNucleoRepo } from "../../modules/material/material.repo";


//Time
import { fazerTimeController } from "../../modules/time/time.controller";
import { fazerTimeService } from "../../modules/time/time.service";
import { fazerTimeRepo } from "../../modules/time/time.repo";

//Postagem
import { fazerPostagemController } from "../../modules/postagem/postagem.controller";
import { fazerPostagemService } from "../../modules/postagem/postagem.service";
import { fazerPostagemRepo } from "../../modules/postagem/postagem.repo";
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

const jogadorRepo = fazerJogadorRepo(AppDataSource);
const jogadorService = fazerJogadorService(jogadorRepo);
export const jogadorController = fazerJogadorController(jogadorService);

const treinoRepo = fazerTreinoRepo(AppDataSource);
const treinoService = fazerTreinoService(treinoRepo);
export const treinoController = fazerTreinoController(treinoService);





const classificacaoRepo = fazerClassificacaoRepo(AppDataSource);
const classificacaoService = fazerClassificacaoService(classificacaoRepo);
export const classificacaoController = fazerClassificacaoController(classificacaoService);

const competicaoRepo = fazerCompeticaoRepo(AppDataSource);
const competicaoService = fazerCompeticaoService(competicaoRepo, AppDataSource);
export const competicaoController = fazerCompeticaoController(competicaoService);

const materialNucleoRepo = fazerMaterialNucleoRepo(AppDataSource);
const materialNucleoService = fazerMaterialNucleoService(materialNucleoRepo);
export const materialNucleoController = fazerMaterialNucleoController(materialNucleoService);

const timeRepo = fazerTimeRepo(AppDataSource);
const timeService = fazerTimeService(timeRepo);
export const timeController = fazerTimeController(timeService);
const jogoRepo = fazerJogoRepo(AppDataSource);
const jogoService = fazerJogoService(jogoRepo, timeRepo);
export const jogoController = fazerJogoController(jogoService);

const eventoJogoRepo = fazerEventoJogoRepo(AppDataSource);
const eventoJogoService = fazerEventoJogoService(eventoJogoRepo, jogoRepo);
export const eventoJogoController = fazerEventoJogoController(eventoJogoService);

const chamadaRepo = fazerChamadaRepo(AppDataSource);
const chamadaService = fazerChamadaService(chamadaRepo, timeRepo);
export const chamadasController = fazerChamadaController(chamadaService);

const frequenciaRepo = fazerFrequenciaRepo(AppDataSource);
const frequenciaService = fazerFrequenciaService(frequenciaRepo, jogadorRepo, chamadaRepo);
export const frequenciaController = fazerFrequenciaController(frequenciaService);

const postagemRepo = fazerPostagemRepo(AppDataSource);
const postagemService = fazerPostagemService(postagemRepo);
export const postagemController = fazerPostagemController(postagemService);