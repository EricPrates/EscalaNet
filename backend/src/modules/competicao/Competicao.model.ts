import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "../jogo/Jogo.model";
import { Time } from "../time/time.model";

export class Competicao {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string
    @OneToMany(() => Jogo, (jogo) => jogo.competicao)
    jogos?: Jogo[] | null;
    @OneToMany(() => Time, (time) => time.competicoes)
    times?: Time[] | null;
    @Column({ type: "varchar", length: 255, nullable: false })
    tipo!: 'Copa' | 'Dupla Eliminatória' | 'Liga';
}