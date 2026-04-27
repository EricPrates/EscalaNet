import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, Entity, Index, JoinColumn } from 'typeorm';
import { Nucleo } from "../nucleo/Nucleo.model";
import { Aluno } from "../aluno/Aluno.model";
import { Categoria } from '../categoria/Categoria.model';
import { Usuario } from '../usuario/Usuario.model';
import { Jogo } from '../jogo/Jogo.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';

@Entity({ name: "times" })
export class Time {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string;

    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.times, { nullable: false })
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo;

    @Index()
    @ManyToOne(() => Categoria, { nullable: false })
    @JoinColumn({ name: "categoria_id" })
    categoria!: Categoria; 

    @Index()
    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: "treinador_id" })
    treinador!: Usuario;

    @OneToMany(() => Aluno, (aluno) => aluno.time)
    jogadores!: Aluno[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeA)
    jogosComoTimeA!: Jogo[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeB)
    jogosComoTimeB!: Jogo[];

    @OneToMany(() => EventosJogo, (evento) => evento.time)
    eventos!: EventosJogo[];
}