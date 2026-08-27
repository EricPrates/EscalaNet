import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { Treino } from '../treino/Treino.model';
import { Jogo } from '../jogo/Jogo.model';
import { Time } from '../time/time.model';
import { Frequencia } from '../frequencia/frequencia.model';
import { Nucleo } from '../nucleo/Nucleo.model';


@Entity({ name: "chamada" })
export class Chamada {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Nucleo, { nullable: false })
    @JoinColumn({ name: 'nucleo_id' })
    nucleo!: Nucleo;

    @Index()
    @Column({ type: 'date' })
    data!: Date;


    @ManyToOne(() => Treino, { nullable: true })
    @JoinColumn({ name: "treino_id" })
    treino?: Treino;

    @ManyToOne(() => Jogo, { nullable: true })
    @JoinColumn({ name: "jogo_id" })
    jogo?: Jogo;

    @ManyToOne(() => Time, (time) => time.chamadas, { nullable: false })
    @JoinColumn({ name: "time_id" })
    time!: Time;
    

    @OneToMany(() => Frequencia, (freq) => freq.chamada)
    frequencias!: Frequencia[];
}