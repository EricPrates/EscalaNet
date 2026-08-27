import "reflect-metadata";
import express, { Request, Response } from "express"; // ← adicionar Request, Response
import { AppDataSource } from "../data-source";
import dotenv from "dotenv";
import cors from "cors";
import { middlewareTokenContexto } from "./shared/Middlewares/middlewareTokenContexto";
import { errorHandler } from "./shared/Middlewares/erroHandler";
import { usuarioController } from './shared/factory/container';
import { validate } from "./shared/Middlewares/validadorSchema";
import { SchemaLoginUsuario } from "./modules/usuario/usuario.schemas";
import nucleoRoutes from "./modules/nucleo/nucleo.routes";
import usuarioRoutes from "./modules/usuario/usuario.routes";
import categoriaRoutes from "./modules/categoria/categoria.routes";
import timeRoutes from "./modules/time/time.routes";
import jogadorRoutes from "./modules/jogador/jogador.routes";
import jogoRoutes from "./modules/jogo/jogo.routes";
import eventosJogoRoutes from "./modules/eventos_jogo/eventos_jogo.routes";
import classificacaoRoutes from "./modules/classificacao/classificacao.routes";
import competicaoRoutes from "./modules/competicao/competicao.routes";
import frequenciaRoutes from "./modules/frequencia/frequencia.routes";
import materialRoutes from "./modules/material/material.routes";
import chamadaRoutes from "./modules/chamada/chamada.routes";
import treinoRoutes from "./modules/treino/treino.routes";
import postagemRoutes, { routerProtected as postagemAdminRoutes } from "./modules/postagem/postagem.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import relatorioRoutes from "./modules/relatorio/relatorio.routes";
import dashRoutes from "./modules/dash/dash.routes";

dotenv.config();

const app: express.Application = express();
const corsOptions = {
  origin: '*', 
  exposedHeaders: ['Authorization', 'authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req: Request, res: Response) => {
  res.json({ mensagem: "API EscalaNet Online - Use /login para entrar" });
});


app.post('/login', validate(SchemaLoginUsuario, 'body'), usuarioController.login);
app.use(middlewareTokenContexto);
app.use('/postagens', postagemRoutes);
app.use('/admin/postagens', postagemAdminRoutes);

uploadRoutes(app);   
categoriaRoutes(app);
nucleoRoutes(app);
usuarioRoutes(app);
timeRoutes(app);
jogadorRoutes(app);
jogoRoutes(app);
eventosJogoRoutes(app);
classificacaoRoutes(app);
competicaoRoutes(app);
materialRoutes(app);
frequenciaRoutes(app);
chamadaRoutes(app);
treinoRoutes(app);
relatorioRoutes(app);
dashRoutes(app); 


app.use(errorHandler);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

(async () => {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`EscalaNet rodando na porta ${PORT} ` + `banco de dados conectado: ${AppDataSource.options.database}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
})();

export default app;