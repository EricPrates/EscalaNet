import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { Core } from "./Core";


@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password!: string;


    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @Column({
        type: "varchar", length: 50, nullable: false, default: "coordinator"
    })
    role!: "admin" | "coordinator";

    @OneToMany(() => Core, (core) => core.admin)
    coresAdministered!: Core[];

    @OneToOne(() => Core, (core) => core.coordenador)
    coreCoordenated!: Core | null;
}

