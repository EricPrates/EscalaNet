import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Jogador } from '../jogador/jogador.model';
import { Treino } from '../treino/Treino.model';
import { Jogo } from '../jogo/Jogo.model';

@Entity({ name: "frequencia" })
export class Frequencia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: 'date' })
    data!: Date;
    
    @Column({ type: 'boolean' })
    presente!: boolean;

    @Index()
    @ManyToOne(() => Jogador, (jogador) => jogador.frequencias)
    @JoinColumn({ name: "jogador_id" })
    jogador!: Jogador;

    @Index()
    @ManyToOne(() => Treino, (treino) => treino.frequencias)
    @JoinColumn({ name: "treino_id" })
    treino!: Treino;

    @ManyToOne(() => Jogo, { nullable: true })
    jogo?: Jogo | null;
}