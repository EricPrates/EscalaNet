import {  Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nucleo } from "./Nucleo";

@Entity({ name: "jogos" })
export class Jogo {
    @PrimaryGeneratedColumn()
    id!: number;

  
    @ManyToMany(() => Nucleo, (nucleo) => nucleo.jogos, {lazy: true})
    nucleos!: Promise<Nucleo[]>;
}