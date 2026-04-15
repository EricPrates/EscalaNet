import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, ManyToMany, OneToMany } from "typeorm";
import { Nucleo } from "./Nucleo";
import { Treino } from "./Treino";
import { Frequencia } from "./Frequencia";
import { Categoria } from "./Categoria";

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
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.alunos, {lazy: true})
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Promise<Nucleo>;

    @ManyToMany(() => Treino, (treino) => treino.alunos, {lazy: true})
    treinos!: Promise<Treino[]>;

    @OneToMany(() => Frequencia, (frequencia) => frequencia.aluno, {lazy: true})
    frequencias!: Promise<Frequencia[]>;

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @Index()
    @ManyToOne(() => Categoria, (categoria) => categoria.alunos, {lazy: true})
    @JoinColumn({ name: "categoria_id" })
    categoria!: Promise<Categoria | null>;

} 