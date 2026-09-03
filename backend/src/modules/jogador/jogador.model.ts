import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, ManyToMany, OneToMany } from "typeorm";
import { Treino } from "../treino/Treino.model";
import { Frequencia } from "../frequencia/frequencia.model";
import { EventosJogo } from "../eventos_jogo/EventosJogo.model";
import { Time } from "../time/time.model";
import { Nucleo } from "../nucleo/Nucleo.model";

@Index(["time", "dataNascimento"])
@Entity({ name: "jogadores" })
export class Jogador {

    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: "varchar", length: 255, nullable: false })
    responsavel!: string;
    @Column({ type: "varchar", length: 255, nullable: false })
    cpf!: string;
    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Index()
    @Column({ type: "date", nullable: false })
    dataNascimento!: Date;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.jogadores)
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Index()
    @ManyToOne(() => Time, (time) => time.jogadores)
    @JoinColumn({ name: "time_id" })
    time?: Time;

    @ManyToMany(() => Treino, (treino) => treino.jogadores)
    treinos!: Treino[];

    @OneToMany(() => Frequencia, (frequencia) => frequencia.jogador)
    frequencias!: Frequencia[];

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefone!: string;
    
    @OneToMany(() => EventosJogo, (eventos) => eventos.jogadorEnvolvido)
    eventos!: EventosJogo[];

    @Column({ type: "varchar", length: 50, nullable: false })
    matricula!: string;

}