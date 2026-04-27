import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Treino } from '../treino/Treino.model';
import { Time } from '../time/time.model';
import { MaterialRepasse } from '../materialNucleo/MaterialRepasse';
import { Usuario } from '../usuario/Usuario.model';


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

   
    @OneToMany(() => Time, (time) => time.nucleo)
    times!: Time[]; 

    @OneToMany(() => Treino, (treino) => treino.nucleo)
    treinos!: Treino[]; 

    @OneToMany(() => Usuario, (usuario) => usuario.nucleoVinculado)
    usuariosVinculados!: Usuario[];

    @OneToMany(() => MaterialRepasse, (repasse) => repasse.nucleo)
    materiaisRecebidos!: MaterialRepasse[]; 
}