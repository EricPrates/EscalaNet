import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "../jogo/Jogo.model";
import { Time } from "../time/time.model";

@Entity({ name: "competicoes" })
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
    tipo!: 'Copa' | 'Liga';
}