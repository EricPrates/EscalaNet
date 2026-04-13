import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import cors from "cors";
import { middlewareTokenContexto } from "./Middlewares/middlewareTokenContexto";
import { errorHandler } from "./Middlewares/erroHandler";
import { usuarioController } from "./Containers/user.container";
dotenv.config();

const app: express.Application = express();
const corsOptions = {
  origin: '*', 
  exposedHeaders: ['Authorization'] 
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const apiRouter = express.Router();

apiRouter.post('/registrar', usuarioController.criarUsuario);
apiRouter.post('/login', usuarioController.login);
apiRouter.use(middlewareTokenContexto);


app.use('/EscalaNet', apiRouter);
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