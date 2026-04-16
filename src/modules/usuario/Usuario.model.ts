import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Index, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Treino } from "../treino/Treino.model";
import { Jogo } from "../jogo/Jogo.model";



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
    permissao!: "admin" | "coordenador" | "professor" | "arbitro" | "auxiliar";

    @OneToMany(() => Nucleo, (nucleo) => nucleo.admin)
    nucleosAdministrados?: Nucleo[];

    @ManyToMany(() => Treino, (treino) => treino.usuarios)
    treinos?: Treino[];

    @OneToOne(() => Nucleo, (nucleo) => nucleo.coordenador)
    nucleoCoordenado?: Nucleo | null;

    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.professores)
    @JoinColumn({ name: "nucleo_id" })
    nucleoOndeProfessor?: Nucleo | null;

    @OneToMany(() => Jogo, (jogo) => jogo.arbitro)
    jogos?: Jogo[];

    
}

