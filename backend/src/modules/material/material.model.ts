// material.model.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { MaterialRepasse } from "../materialNucleo/MaterialRepasse";


@Entity({ name: "materiais" })
export class Material {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    descricao!: string; // Ex: "Bola de Futebol"

    @Column({ type: "int", nullable: false, default: 0 })
    quantidadeTotal!: number; // Estoque total disponível

    @OneToMany(() => MaterialRepasse, (repasse) => repasse.material)
    repasses!: MaterialRepasse[]; // Histórico de repasses
}