import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,   UpdateDateColumn,   Index, OneToMany } from 'typeorm';
import { Jogo } from '../jogo/Jogo.model';
import { Time } from '../time/time.model';


@Entity({ name: "categorias" })
@Index(['idadeMinima', 'idadeMaxima'])
export class Categoria {

    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    nome!:  string;

    @Index()
    @Column({ type: "int",  nullable: false })
    idadeMaxima!: number;

    @Index()
    @Column({ type: "boolean", default: true })
    ativa!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
    
   
    @OneToMany(() => Time, (time) => time.categoria)
    times!: Time[];


    @OneToMany(() => Jogo, (jogo) => jogo.categoria)
    jogos!: Jogo[];
}