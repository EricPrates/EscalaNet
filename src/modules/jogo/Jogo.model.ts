import { Column, Entity,  PrimaryGeneratedColumn, ManyToOne, JoinColumn,  Index, OneToMany } from 'typeorm';
import { Nucleo } from "../nucleo/Nucleo.model";
import { Usuario } from '../usuario/Usuario.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';

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
    
}