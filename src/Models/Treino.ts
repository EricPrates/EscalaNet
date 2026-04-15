import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Nucleo } from "./Nucleo";
import { Aluno } from "./Aluno";
import { Usuario } from "./Usuario";

@Entity({ name: "treinos" })
export class Treino {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.treinos)
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Promise<Nucleo[]>;

    @ManyToMany(() => Aluno, (aluno) => aluno.treinos)
    @JoinTable({ 
        name: "treino_alunos",
        joinColumn:{name: "treino_id", referencedColumnName: "id"},
        inverseJoinColumn:{name: "aluno_id", referencedColumnName: "id"}
    })
    alunos!: Promise<Aluno[]>;
    @ManyToMany(() => Usuario, (usuario) => usuario.treinos)
    usuarios!: Promise<Usuario[]>;
}