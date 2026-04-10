import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}
export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  ssl: { rejectUnauthorized: false }, 
  synchronize: process.env.NODE_ENV !== "production", 
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
});