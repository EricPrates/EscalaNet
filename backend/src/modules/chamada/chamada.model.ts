import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index } from 'typeorm';

import { Treino } from '../treino/Treino.model';
import { Jogo } from '../jogo/Jogo.model';
import { Time } from '../time/time.model';
import { Frequencia } from '../frequencia/frequencia.model';

@Entity({ name: "chamada" })
export class Chamada {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Index()
    @Column({ type: 'date' })
    data!: Date;

    @ManyToOne(() => Treino, { nullable: true })
    treino?: Treino;

    @ManyToOne(() => Jogo, { nullable: true })
    jogo?: Jogo;

    @ManyToOne(() => Time)
    time!: Time;

    @OneToMany(() => Frequencia, (freq) => freq.chamada)
    frequencias!: Frequencia[];
}