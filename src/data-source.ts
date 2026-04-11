import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./Models/User";
import { Core } from "./Models/Core";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Validação para produção
if (isProduction) {
  const requiredVars = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASS"];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente faltando: ${missing.join(", ")}`);
  }
}

const AppDataSource = new DataSource(
  isProduction
    ? {
        type: "mysql",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "3306"),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: false,
        logging: false,
        entities: [User, Core],
        migrations: ["src/migrations/**/*.ts"],
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
        },
      }
    : {
        type: "sqlite",
        database: process.env.SQLITE_DB || "database.sqlite",
        synchronize: true,
        logging: true,
        entities: [User, Core],
      }
);

export { AppDataSource };