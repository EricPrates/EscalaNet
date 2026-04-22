import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, ManyToMany, OneToMany } from "typeorm";
import { Treino } from "../treino/Treino.model";
import { Frequencia } from "../frequencia/frequencia.model";
import { EventosJogo } from "../eventos_jogo/EventosJogo.model";
import { Time } from "../time/time.model";

@Index(["nucleo", "dataNascimento"])
@Entity({ name: "alunos" })
export class Aluno {

    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Index()
    @Column({ type: "date", nullable: false })
    dataNascimento!: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Index()
    @ManyToOne(() => Time, (time) => time.jogadores)
    @JoinColumn({ name: "time_id" })
    time!: Time;

    @ManyToMany(() => Treino, (treino) => treino.alunos)
    treinos!: Treino[];

    @OneToMany(() => Frequencia, (frequencia) => frequencia.aluno)
    frequencias!: Frequencia[];

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @Index()
    @Column({ type: "varchar", length: 20, nullable: true })
    telefone?: string;

    @OneToMany(() => EventosJogo, (eventos) => eventos.alunoEnvolvido)
    eventos!: EventosJogo[];



}