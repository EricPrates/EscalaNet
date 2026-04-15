import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";


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
    entities: [__dirname + "/modules/**/*.model.{js,ts}"],
    migrations: ["src/migrations/**/*.ts"],
});



export { AppDataSource };