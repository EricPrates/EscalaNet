import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { User } from "./User";
import { Student } from './Students';
import { Categorie } from './Categorie';


@Entity({ name: "cores" })
export class Core {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.coresAdministered)
    @JoinColumn({ name: "admin_id" })
    admin!: User;

    @OneToOne(() => User, (user) => user.coreCoordenated)
    @JoinColumn({ name: "coordenador_id" })
    coordenador!: User | null;

    @OneToMany(() => Student, (student) => student.core)
    students!: Student[];
    @ManyToMany(() => Categorie, (categorie) => categorie.cores)
    @JoinColumn({ name: "categorie_id", referencedColumnName: "id" })
    categories!: Categorie[];


}