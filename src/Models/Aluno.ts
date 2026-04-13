import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Nucleo } from "./Nucleo";

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

}