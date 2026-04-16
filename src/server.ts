import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import cors from "cors";
import { middlewareTokenContexto } from "./shared/Middlewares/middlewareTokenContexto";
import { errorHandler } from "./shared/Middlewares/erroHandler";
import { usuarioController } from "./shared/factory/container";
import { validate } from "./shared/Middlewares/validadorSchema";
import { SchemaCriarUsuario, SchemaLoginUsuario } from "./modules/usuario/usuario.schemas";

dotenv.config();

const app: express.Application = express();
const corsOptions = {
  origin: '*', 
  exposedHeaders: ['Authorization', 'authorization']
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const apiRouter = express.Router();






app.use('/EscalaNet', apiRouter);

apiRouter.get('/', (_req, res) => {
  res.json({ mensagem: "API EscalaNet Online - Use /login para entrar" });
});
apiRouter.post('/login', validate(SchemaLoginUsuario, 'body'), usuarioController.login);
apiRouter.post('/usuario', validate(SchemaCriarUsuario, 'body'), usuarioController.criarUsuario);
apiRouter.use(middlewareTokenContexto);

app.use(errorHandler);
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 3000;

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