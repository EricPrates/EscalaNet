import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Jogador } from '../jogador/jogador.model';
import { Chamada } from '../chamada/chamada.model';

@Entity({ name: "frequencia" })
export class Frequencia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'boolean' })
    presente!: boolean;

    @Index()
    @ManyToOne(() => Jogador, (jogador) => jogador.frequencias)
    @JoinColumn({ name: "jogador_id" })
    jogador!: Jogador;

    @Column({ type: 'varchar', length: 255, nullable: true })
    justificativa?: string | null;

    @ManyToOne(() => Chamada, (chamada) => chamada.frequencias)
    chamada!: Chamada;
}