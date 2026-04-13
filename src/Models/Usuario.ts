import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Index } from "typeorm";
import { Nucleo } from "./Nucleo";


@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Index()
    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    senha!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

   
    @Column({
        type: "varchar", length: 50, nullable: false, default: "coordenador"
    })
    role!: "admin" | "coordenador";

    @OneToMany(() => Nucleo, (nucleo) => nucleo.admin , {lazy: true})
    nucleosAdministrados!: Promise<Nucleo[]>;

    @Index()
    @OneToOne(() => Nucleo, (nucleo) => nucleo.coordenador, {lazy: true})
    nucleoCoordenado!: Promise<Nucleo | null>;
}

