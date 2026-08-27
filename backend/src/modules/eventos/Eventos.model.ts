import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Usuario } from '../usuario/Usuario.model';
import { Nucleo } from "../nucleo/Nucleo.model";

@Entity({ name: "eventos" })

export class 
Eventos {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToMany(() => Usuario, (usuario) => usuario.eventos)
    @JoinTable({
        name: "eventos_usuarios",
        joinColumn: { name: "evento_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "usuario_id", referencedColumnName: "id" }
    })
    usuarios!: Usuario[];

    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    descricao!: string | null;

    @Column({ type: "date", nullable: false })
    data!: Date;

    @Column({ type: "time", nullable: false })
    hora!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    local!: string | null;

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.eventos)
    nucleo?: Nucleo | null;
}