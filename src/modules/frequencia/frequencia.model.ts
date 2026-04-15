import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Aluno } from '../aluno/Aluno.model';
import { Treino } from '../treino/Treino.model';

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
    @ManyToOne(() => Aluno, (aluno) => aluno.frequencias)
    @JoinColumn({ name: "aluno_id" })
    aluno!: Aluno;

    @Index()
    @ManyToOne(() => Treino, (treino) => treino.frequencias)
    @JoinColumn({ name: "treino_id" })
    treino!: Treino;
}