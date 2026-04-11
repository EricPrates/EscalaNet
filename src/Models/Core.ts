import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,  UpdateDateColumn, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { User } from "./User";


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

    @ManyToOne(() => User,)
    @JoinColumn({ name: "admin_id", referencedColumnName: "id" })
    admin!: User;
    
    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: "coordenador_id", referencedColumnName: "id" })
    coordenador!: User;
 
}