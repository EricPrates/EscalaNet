import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "./src/modules/usuario/Usuario.model";
import { Time } from './src/modules/time/time.model';
import { Nucleo } from './src/modules/nucleo/Nucleo.model';
import { Jogador } from './src/modules/jogador/jogador.model';
import { Jogo } from './src/modules/jogo/Jogo.model';
import { EventosJogo } from './src/modules/eventos_jogo/EventosJogo.model';
import { Classificacao } from './src/modules/classificacao/Classificacao.model';
import { Competicao } from './src/modules/competicao/Competicao.model';
import { Frequencia } from './src/modules/frequencia/frequencia.model';
import { Material } from './src/modules/material/material.model';
import { Chamada } from './src/modules/chamada/chamada.model';
import { Treino } from './src/modules/treino/Treino.model';
import { Categoria } from "./src/modules/categoria/Categoria.model";
import { Postagem } from "./src/modules/postagem/postagem.model";
import { Eventos } from "./src/modules/eventos/Eventos.model";
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = isTest
    ? new DataSource({
          type:"mysql",
          host: process.env.DB_HOST_TEST,
          port: parseInt(process.env.DB_PORT_TEST || "3306"),
          username: process.env.DB_USER_TEST,
          password: process.env.DB_PASS_TEST,
          database: process.env.DB_NAME_TEST,
          synchronize: false,
          logging: true,
          entities: [Usuario, Time, Nucleo, Jogador, Jogo, EventosJogo, Classificacao, Competicao, Frequencia, Material, Chamada, Treino, Categoria, Postagem, Eventos],
          
          migrations: ["src/migrations/**/*.ts"],
      })
    : new DataSource({
          type: "mysql",
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || "3306"),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: false,
          logging: true,
           entities: [Usuario, Time, Nucleo, Jogador, Jogo, EventosJogo, Classificacao, Competicao, Frequencia, Material, Chamada, Treino, Categoria, Postagem, Eventos],
          migrations: ["src/migrations/**/*.ts"],
      });

      // data-source.ts (logo após definir AppDataSource)
console.log('Caminho das entidades:', __dirname + "/modules/**/*.model.{js,ts}");