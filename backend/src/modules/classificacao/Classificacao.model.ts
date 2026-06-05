// classificacao.model.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Competicao } from '../competicao/Competicao.model';
import { Time } from '../time/time.model';

@Entity({ name: "classificacoes" })
export class Classificacao {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Competicao)
    @JoinColumn({ name: "competicao_id" })
    competicao!: Competicao;

    @ManyToOne(() => Time)
    @JoinColumn({ name: "time_id" })
    time!: Time;

    @Column({ default: 0 })
    pontos!: number;

    @Column({ default: 0 })
    jogos!: number;

    @Column({ default: 0 })
    vitorias!: number;

    @Column({ default: 0 })
    empates!: number;

    @Column({ default: 0 })
    derrotas!: number;

    @Column({ default: 0 })
    golsPro!: number;

    @Column({ default: 0 })
    golsContra!: number;

    @Column({ default: 0 })
    saldoGols!: number;

    @Column({ default: 0 })
    aproveitamento!: number;
}