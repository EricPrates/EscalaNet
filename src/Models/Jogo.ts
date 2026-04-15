import { Column, Entity,  PrimaryGeneratedColumn, ManyToOne, JoinColumn,  Index, OneToMany } from 'typeorm';
import { Nucleo } from "./Nucleo";
import { Usuario } from './Usuario';
import { EventosJogo } from './EventosJogo';

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
    @Column({ type: "varchar", length: 1000, nullable: true })
    sumula!: string;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.jogosTimeA, { lazy: true })
    @JoinColumn({ name: "time_a_id" })
    timeA!: Promise<Nucleo | null>;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.jogosTimeB, { lazy: true })
    @JoinColumn({ name: "time_b_id" })
    timeB!: Promise<Nucleo | null>;

    @ManyToOne(() => Usuario, (usuario) => usuario.jogos, { lazy: true })
    @JoinColumn({ name: "arbitro_id" })
    arbitro!: Promise<Usuario | null>;

    @OneToMany(() => EventosJogo, (eventosJogo) => eventosJogo.jogo, { lazy: true })
    eventos!: Promise<EventosJogo[]>;
    
}