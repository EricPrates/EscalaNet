import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,   UpdateDateColumn,   Index, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Jogo } from '../jogo/Jogo.model';
import { Time } from '../time/time.model';
import { Jogador } from '../jogador/jogador.model';


export const sexo = [
    'M',
    'F'
] as const;

export type SexoType = typeof sexo[number];

@Entity({ name: "categorias" })

export class Categoria {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    nome!:  string;

    @Index()
    @Column({ type: "int",  nullable: false })
    idadeMaxima!: number;

    @Index()
    @Column({ type: "boolean", default: true })
    ativa!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date | undefined;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
    
   
    @ManyToMany(() => Time, (time) => time.categorias)
    times?: Time[];


    @OneToMany(() => Jogo, (jogo) => jogo.categoria)
    jogos!: Jogo[];

    @Column({ type: "varchar", length: 1, nullable: true })
    sexo?: SexoType | null;

    @ManyToMany(() => Jogador, (jogador) => jogador.categorias)
    @JoinTable({
        name: "categoria_jogadores",
        joinColumn: { name: "categoria_id" },
        inverseJoinColumn: { name: "jogador_id" },
    })
    jogadores?: Jogador[];
}