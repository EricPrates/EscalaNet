import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Aluno } from './Aluno';
import { Treino } from './Treino';

@Entity({ name: "frequencia" })
export class Frequencia {
    @PrimaryGeneratedColumn()
        id!: number;

    @Column({type:'date'})
    data!: Date;

    @Column({type:'boolean'})
    presente!: boolean;

    @ManyToOne(() => Aluno, (aluno) => aluno.frequencias, {lazy: true})
    @JoinColumn({ name: "aluno_id" })
    aluno!: Promise<Aluno>;

    @ManyToOne(() => Treino, (treino) => treino.frequencias, {lazy: true})
    @JoinColumn({ name: "treino_id" })
    treino!: Promise<Treino>;
}