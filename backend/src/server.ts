import "reflect-metadata";
import express, { Request, Response } from "express"; // ← adicionar Request, Response
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import cors from "cors";
import { middlewareTokenContexto } from "./shared/Middlewares/middlewareTokenContexto";
import { errorHandler } from "./shared/Middlewares/erroHandler";
import { usuarioController } from "./shared/factory/container";
import { validate } from "./shared/Middlewares/validadorSchema";
import { SchemaBaseUsuario, SchemaLoginUsuario } from "./modules/usuario/usuario.schemas";
import nucleoRoutes from "./modules/nucleo/nucleo.routes";
import usuarioRoutes from "./modules/usuario/usuario.routes";
import categoriaRoutes from "./modules/categoria/categoria.routes";
import timeRoutes from "./modules/time/time.routes";
import jogadorRoutes from "./modules/jogador/jogador.routes";
import jogoRoutes from "./modules/jogo/jogo.routes";
import eventosJogoRoutes from "./modules/eventos_jogo/eventos_jogo.routes";
import classificacaoRoutes from "./modules/classificacao/classificacao.routes";

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
app.post('/usuario', validate(SchemaBaseUsuario, 'body'), usuarioController.criarUsuario);


app.use(middlewareTokenContexto);


categoriaRoutes(app);
nucleoRoutes(app);
usuarioRoutes(app);
timeRoutes(app);
jogadorRoutes(app);
jogoRoutes(app);
eventosJogoRoutes(app);
classificacaoRoutes(app);


app.use(errorHandler);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

(async () => {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`EscalaNet rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
})();

export default app;