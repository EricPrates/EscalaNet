import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import cors from "cors";
import { contextMiddleware } from "./Middleware/context.middleware";
import { errorHandler } from "./Middleware/erroHandler";
dotenv.config();

const app: express.Application = express();
const corsOptions = {
  origin: '*', 
  
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login') //criar rota de login;
app.use('/register') //criar rota de registro;
app.use(contextMiddleware); 
// app.use('/admin', adminProcessToken); // Middleware para proteger rotas de admin
// app.use(errorHandler); // Middleware para tratamento de erros




app.use(errorHandler);
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 3000;

(async () => {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
})();

export default app;