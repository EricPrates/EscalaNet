import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable, ManyToMany, Index } from 'typeorm';
import { Usuario } from "../usuario/Usuario.model";
import { Categoria } from '../categoria/Categoria.model';
import { Treino } from '../treino/Treino.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';
import { Time } from '../time/time.model';
import { MaterialRepasse } from '../materialNucleo/MaterialRepasse';


@Entity({ name: "nucleos" })
export class Nucleo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string;

    
    @Column({ type: "varchar", length: 1000, nullable: true })
    endereco!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
    
    
    @OneToMany(() => Treino, (treino) => treino.nucleo )
    treinos?: Treino[];

    @OneToMany(() => Usuario, (usuario) => usuario.nucleoVinculado)
    usuariosVinculados?: Usuario[];
  
    @ManyToMany(() => Categoria, (categoria) => categoria.nucleos )
    @JoinTable({
        name: "nucleos_categorias",
        joinColumn: { name: "nucleo_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoria_id", referencedColumnName: "id" }
    })
    categorias?: Categoria[];

    @OneToMany(() => Time, (time) => time.nucleoVinculado )
    times?: Time[];

    @OneToMany(() => EventosJogo, (eventos) => eventos.nucleo )
    eventos?: EventosJogo[];

    @OneToMany(() => MaterialRepasse, (material) => material.nucleo )
    materiais?:  MaterialRepasse[];
}