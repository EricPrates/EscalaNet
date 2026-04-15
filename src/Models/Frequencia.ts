import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Aluno } from './Aluno';
import { Treino } from './Treino';

@Entity({ name: "frequencia" })
export class Frequencia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: 'date' })
    data!: Date;

    @Index()
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