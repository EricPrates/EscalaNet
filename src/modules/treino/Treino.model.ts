import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Jogador } from "../jogador/jogador.model";
import { Usuario } from "../usuario/Usuario.model";
import { Frequencia } from "../frequencia/frequencia.model";

@Entity({ name: "treinos" })
export class Treino {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "date", nullable: false })
    data!: Date;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.treinos)
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo;

    @ManyToMany(() => Jogador, (jogador) => jogador.treinos)
    @JoinTable({ 
        name: "treino_alunos",
        joinColumn: { name: "treino_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "jogador_id", referencedColumnName: "id" }
    })
    jogadores!: Jogador[];

    @ManyToMany(() => Usuario, (usuario) => usuario.treinos)
    usuarios!: Usuario[];

    @OneToMany(() => Frequencia, (frequencia) => frequencia.treino)
    frequencias!: Frequencia[];
}
