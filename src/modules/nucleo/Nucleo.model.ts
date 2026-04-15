import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany, Index } from 'typeorm';
import { Usuario } from "../usuario/Usuario.model";
import { Aluno } from '../aluno/Aluno.model';
import { Categoria } from '../categoria/Categoria.model';
import { Jogo } from '../jogo/Jogo.model';
import { Treino } from '../treino/Treino.model';


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

   
    @ManyToOne(() => Usuario, (usuario) => usuario.nucleosAdministrados)
    @JoinColumn({ name: "admin_id" })
    admin!: Usuario;

    @Index()
    @OneToOne(() => Usuario, (usuario) => usuario.nucleoCoordenado )
    @JoinColumn({ name: "coordenador_id" })
    coordenador?: Usuario | null;

   
    @OneToMany(() => Usuario, (usuario) => usuario.nucleoOndeProfessor )
    professores!: Usuario[];

    @OneToMany(() => Treino, (treino) => treino.nucleo )
    treinos!: Treino[];

    @OneToMany(() => Aluno, (aluno) => aluno.nucleo )
    alunos!: Aluno[];

  
    @ManyToMany(() => Categoria, (categoria) => categoria.nucleos )
    @JoinTable({
        name: "nucleos_categorias",
        joinColumn: { name: "nucleo_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoria_id", referencedColumnName: "id" }
    })
    categorias!: Categoria[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeA )
    jogosTimeA!: Jogo[];

    @OneToMany(() => Jogo, (jogo) => jogo.timeB )
    jogosTimeB!: Jogo[];


}