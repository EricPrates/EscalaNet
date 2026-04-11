import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

if (!isProduction && !isDevelopment) {
  console.warn(" NODE_ENV não definido. Usando modo desenvolvimento.");
}

let dataSourceConfig: any;

if (isProduction) {
  // PRODUÇÃO: MySQL remoto
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(" DATABASE_URL é obrigatório em produção");
  }
  
  // SSL condicional
  let sslConfig = undefined;
  const sslPath = process.env.SSL_CA_PATH;
  if (sslPath && fs.existsSync(sslPath)) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: fs.readFileSync(sslPath),
    };
  } else if (databaseUrl.includes("?ssl=true") || databaseUrl.includes("ssl-mode=require")) {
    sslConfig = { rejectUnauthorized: false };
  }
  
  dataSourceConfig = {
    type: "mysql",
    url: databaseUrl,
    ssl: sslConfig,
    synchronize: false,
    logging: false,
    entities: ["dist/models/**/*.js"],
    migrations: ["dist/migrations/**/*.js"],
    extra: { connectionLimit: 10 },
  };
  
  console.log("Configuração de PRODUÇÃO (MySQL)");
  
} else {
  // DESENVOLVIMENTO: SQLite
  dataSourceConfig = {
    type: "sqlite",
    database: process.env.DB_PATH || "database.sqlite",
    synchronize: true,
    logging: true,
    entities: ["src/models/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
  };
  
  console.log("✅ Configuração de DESENVOLVIMENTO (SQLite)");
}

export const AppDataSource = new DataSource(dataSourceConfig);