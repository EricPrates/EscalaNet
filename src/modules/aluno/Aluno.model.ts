import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, ManyToMany, OneToMany } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Treino } from "../treino/Treino.model";
import { Frequencia } from "../frequencia/frequencia.model";
import { Categoria } from "../categoria/Categoria.model";
import { EventosJogo } from "../eventos_jogo/EventosJogo.model";

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
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.alunos)
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo;

    @ManyToMany(() => Treino, (treino) => treino.alunos)
    treinos!: Treino[];

    @OneToMany(() => Frequencia, (frequencia) => frequencia.aluno)
    frequencias!: Frequencia[];

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @Index()
    @ManyToOne(() => Categoria, (categoria) => categoria.alunos)
    @JoinColumn({ name: "categoria_id" })
    categoria?: Categoria;

    @OneToMany(() => EventosJogo, (eventos) => eventos.alunoEnvolvido)
    eventos!: EventosJogo[];
}