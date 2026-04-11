import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class Categorie {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
    @CreateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
}