// MaterialRepasse.model.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Material } from "../material/material.model";


@Entity({ name: "materiais_repasses" })
export class MaterialRepasse {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Nucleo, { nullable: false })
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo; 

    @ManyToOne(() => Material, (material) => material.repasses, { nullable: false })
    @JoinColumn({ name: "material_id" })
    material!: Material;

    @Column({ type: "int", nullable: false })
    quantidade!: number; 

    @CreateDateColumn({ name: "data_recebimento" })
    dataRecebimento!: Date; 

    @Column({ type: "text", nullable: true })
    observacao?: string;
}