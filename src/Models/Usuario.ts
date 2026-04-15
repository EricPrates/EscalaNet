import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Index, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Nucleo } from "./Nucleo";
import { Treino } from "./Treino";
import { Jogo } from "./Jogo";



@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Index()
    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    senha!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

   
    @Column({
        type: "varchar", length: 50, nullable: false, default: "coordenador"
    })
    permissao!: "admin" | "coordenador"| "professor" | "arbitro" | "auxiliar";

    @OneToMany(() => Nucleo, (nucleo) => nucleo.admin , {lazy: true})
    nucleosAdministrados!: Promise<Nucleo[]>;

    @ManyToMany(()=> Treino, (treino) => treino.usuarios , {lazy: true})
    treinos!: Promise<Treino[]>;

    @OneToOne(() => Nucleo, (nucleo) => nucleo.coordenador, {lazy: true})
    nucleoCoordenado!: Promise<Nucleo>;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.professores, {lazy: true})
    @JoinColumn({ name: "nucleo_id" })
    nucleoOndeProfessor!: Promise<Nucleo>;

    @OneToMany(() => Jogo, (jogo) => jogo.arbitro, { lazy: true })
    jogos!: Promise<Jogo[]>;
}

