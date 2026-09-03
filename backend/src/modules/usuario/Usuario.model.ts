import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, ManyToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Treino } from "../treino/Treino.model";
import { Jogo } from "../jogo/Jogo.model";
import { EventosJogo } from "../eventos_jogo/EventosJogo.model";
import { Postagem } from "../postagem/postagem.model";
import { Eventos } from "../eventos/Eventos.model";



@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Nucleo, (nucleo) => nucleo.responsavelNucleo, { nullable: true })
    responsavelNucleo?: Nucleo;
    
    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

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
        type: "varchar", length: 50, nullable: false, default: "professor"
    })
    permissao!: "admin" | "professor" | "arbitro" | "auxiliar";


    @ManyToMany(() => Treino, (treino) => treino.usuarios)
    treinos?: Treino[];


    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.usuariosVinculados)
    @JoinColumn({ name: "nucleo_id" })
    nucleoVinculado!: Nucleo | null;
    
    @OneToMany(() => Jogo, (jogo) => jogo.arbitro)
    jogos?: Jogo[];

    @OneToMany(() => EventosJogo, (eventos) => eventos.usuario)
    eventosJogo?: EventosJogo[];
    @OneToOne(() => Postagem, (postagem) => postagem.autor)
    postagem?: Postagem;

    @ManyToMany(() => Eventos, (eventos) => eventos.usuarios)
    eventos?: Eventos[];

    @Column({ type: "varchar", length: 20, nullable: true })
    telefone!: string;
}

