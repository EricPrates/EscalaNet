import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,  ManyToMany } from 'typeorm';
import { Core } from './Core';

@Entity({ name: "categories" })
export class Categorie {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!:  'sub-9' | 'sub-11' | 'sub-13' | 'sub-15' | 'sub-17';

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @CreateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @ManyToMany(() => Core, (core) => core.categories)
    cores!: Core[];
}