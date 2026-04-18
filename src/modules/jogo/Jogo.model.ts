import { Column, Entity,  PrimaryGeneratedColumn, ManyToOne, JoinColumn,  Index, OneToMany } from 'typeorm';
import { Nucleo } from "../nucleo/Nucleo.model";
import { Usuario } from '../usuario/Usuario.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';
import { Categoria } from '../categoria/Categoria.model';
import { Frequencia } from '../frequencia/frequencia.model';

@Entity({ name: "jogos" })
export class Jogo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Index()
    @Column({ type: "date", nullable: false })
    data!: Date;

    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.jogosTimeA, )
    @JoinColumn({ name: "time_a_id" })
    timeA!: Nucleo;

    @Index()
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.jogosTimeB)
    @JoinColumn({ name: "time_b_id" })
    timeB!: Nucleo;

    @Index()
    @ManyToOne(() => Usuario, (usuario) => usuario.jogos)
    @JoinColumn({ name: "arbitro_id" })
    arbitro?: Usuario | null;

    @OneToMany(() => EventosJogo, (eventosJogo) => eventosJogo.jogo)
    eventos!: EventosJogo[];

    @Index()
    @ManyToOne(() => Categoria, (categoria) => categoria.jogos)
    @JoinColumn({ name: "categoria_id" })
    categoria?: Categoria | null;

    @Index()
    @Column({ type: "int", nullable: true, default:0 })
    golsTimeA!: number;

    @Index()
    @Column({ type: "int", nullable: true, default:0 })
    golsTimeB!: number;

    @OneToMany(() => Frequencia, (frequencia) => frequencia.jogo)
    frequencias!: Frequencia[];
}