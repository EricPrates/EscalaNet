import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Treino } from "../treino/Treino.model";
import { Jogo } from "../jogo/Jogo.model";
import { EventosJogo } from "../eventos_jogo/EventosJogo.model";



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


    @ManyToMany(() => Treino, (treino) => treino.usuarios)
    treinos?: Treino[];


    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.usuariosVinculados)
    @JoinColumn({ name: "nucleo_id" })
    nucleoVinculado!: Nucleo | null;
    
    @OneToMany(() => Jogo, (jogo) => jogo.arbitro)
    jogos?: Jogo[];

    @OneToMany(() => EventosJogo, (eventos) => eventos.usuario)
    eventos?: EventosJogo[];
    
}

