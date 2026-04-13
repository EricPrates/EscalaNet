import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "./Models/Usuario";
import { Aluno} from "./Models/Aluno";
import { Categoria } from "./Models/Categoria";
import { Nucleo } from "./Models/Nucleo";

dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // Só em desenvolvimento! Cria/atualiza tabelas automaticamente
    logging: ["query", "error", "schema"],
    entities: [Usuario, Nucleo, Aluno, Categoria],
    migrations: ["src/migrations/**/*.ts"],
});



export { AppDataSource };