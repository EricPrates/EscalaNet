import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    @ManyToMany(() => Time, (time) => time.competicoes)
    @JoinTable({
        name: "competicao_times",
        joinColumn: { name: "competicao_id" },
        inverseJoinColumn: { name: "time_id" },
    })
    times?: Time[] | null;
    @Column({ type: "varchar", length: 255, nullable: false })
    tipo!: 'Copa' | 'Liga';

    @Column({ type: "int", nullable: true, default: 7 })
    intervaloDias?: number;

    @Column({ type: "boolean", nullable: true, default: false })
    duplaVolta?: boolean;
}