import { Column, Entity,  PrimaryGeneratedColumn, ManyToOne, JoinColumn,  Index } from 'typeorm';
import { Nucleo } from "./Nucleo";

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
}