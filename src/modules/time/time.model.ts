import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Nucleo } from "../nucleo/Nucleo.model";
import { Aluno } from "../aluno/Aluno.model";
import { Categoria } from '../categoria/Categoria.model';
import { Usuario } from '../usuario/Usuario.model';
import { Jogo } from '../jogo/Jogo.model';

@Entity({ name: "times" })
export class Time {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string; 

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.times)
    nucleoVinculado!: Nucleo;

    @ManyToOne(() => Categoria)
    categoria!: Categoria;

    @ManyToOne(() => Usuario) // Treinador responsável
    treinador!: Usuario;

    @OneToMany(() => Aluno, (aluno) => aluno.time)
    jogadores!: Aluno[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeA)
    jogosComoTimeA!: Jogo[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeB)
    jogosComoTimeB!: Jogo[];
}