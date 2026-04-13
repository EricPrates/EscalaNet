import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany, Index } from 'typeorm';
import { Usuario } from "./Usuario";
import { Aluno } from './Aluno';
import { Categoria } from './Categoria';
import { Jogo } from './Jogo';


@Entity({ name: "nucleos" })
export class Nucleo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Index()
    @ManyToOne(() => Usuario, (usuario) => usuario.nucleosAdministrados, {lazy: true})
    @JoinColumn({ name: "admin_id" })
    admin!: Promise<Usuario | null>;

    @Index()
    @OneToOne(() => Usuario, (usuario) => usuario.nucleoCoordenado , {lazy: true})
    @JoinColumn({ name: "coordenador_id" })
    coordenador!: Promise<Usuario | null>;

  
    @OneToMany(() => Aluno, (aluno) => aluno.nucleo , {lazy: true})
    alunos!: Promise<Aluno[]>;

  
    @ManyToMany(() => Categoria, (categoria) => categoria.nucleos , {lazy: true})
    @JoinTable({
        name: "nucleos_categorias",
        joinColumn: { name: "nucleo_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoria_id", referencedColumnName: "id" }
    })
    categorias!: Promise<Categoria[]>;

    @ManyToMany(() => Jogo, (jogo) => jogo.nucleos , {lazy: true})
    @JoinTable({
        name: "nucleos_jogos",
        joinColumn: { name: "nucleo_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "jogo_id", referencedColumnName: "id" }
    })
    jogos!: Promise<Jogo[]>;

}