import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany, Index } from 'typeorm';
import { Usuario } from "./Usuario";
import { Aluno } from './Aluno';
import { Categoria } from './Categoria';
import { Jogo } from './Jogo';
import { Treino } from './Treino';


@Entity({ name: "nucleos" })
export class Nucleo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    endereco!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

   
    @ManyToOne(() => Usuario, (usuario) => usuario.nucleosAdministrados, {lazy: true})
    @JoinColumn({ name: "admin_id" })
    admin!: Promise<Usuario | null>;

    @Index()
    @OneToOne(() => Usuario, (usuario) => usuario.nucleoCoordenado , {lazy: true})
    @JoinColumn({ name: "coordenador_id" })
    coordenador!: Promise<Usuario | null>;

    @Index()
    @OneToMany(() => Usuario, (usuario) => usuario.nucleoOndeProfessor , {lazy: true})
    professores!: Promise<Usuario[]>;

    @OneToMany(() => Treino, (treino) => treino.nucleo , {lazy: true})
    treinos!: Promise<Treino[]>;

    @OneToMany(() => Aluno, (aluno) => aluno.nucleo , {lazy: true})
    alunos!: Promise<Aluno[]>;

  
    @ManyToMany(() => Categoria, (categoria) => categoria.nucleos , {lazy: true})
    @JoinTable({
        name: "nucleos_categorias",
        joinColumn: { name: "nucleo_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoria_id", referencedColumnName: "id" }
    })
    categorias!: Promise<Categoria[]>;

    @OneToMany(() => Jogo, (jogo) => jogo.timeA , {lazy: true})
    jogosTimeA!: Promise<Jogo[]>;

    @OneToMany(() => Jogo, (jogo) => jogo.timeB , {lazy: true})
    jogosTimeB!: Promise<Jogo[]>;


}