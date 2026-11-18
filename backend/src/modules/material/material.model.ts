// MaterialRepasse.model.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Nucleo } from "../nucleo/Nucleo.model";


export enum MaterialStatus {
     Bom = "Bom",
    Manutencao = "Manutencao",
     Descartado = "Descartado",
}

@Entity({ name: "materiais" })
export class Material {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Nucleo, { nullable: false })
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo; 

    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    @Column({ type: "int", nullable: false })
    quantidade!: number; 

    @CreateDateColumn({ name: "data_recebimento" })
    dataRecebimento!: Date; 

    @Column({ type: "text", nullable: true })
    observacao?: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    tipoMaterial?: string;
    
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
    
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Column({ type: "enum", enum: MaterialStatus, default: MaterialStatus.Bom })
    status!: MaterialStatus;

    
}
