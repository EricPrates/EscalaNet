import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, OneToOne } from 'typeorm';
import { Treino } from '../treino/Treino.model';
import { Time } from '../time/time.model';

import { Usuario } from '../usuario/Usuario.model';
import { Chamada } from '../chamada/chamada.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';
import { Frequencia } from '../frequencia/frequencia.model';
import { Jogador } from '../jogador/jogador.model';
import { Material } from '../material/material.model';
import { Eventos } from '../eventos/Eventos.model';



@Entity({ name: "nucleos" })
export class Nucleo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefone?: string;
    @OneToOne(() => Usuario, (usuario) => usuario.responsavelNucleo, { nullable: true })
    responsavelNucleo?: Usuario;

    @OneToMany(() => EventosJogo, (eventosJogo) => eventosJogo.nucleo)
    eventosJogo!: EventosJogo[];

    @Index()
    @Column({ type: "varchar", length: 255, nullable: false })
    nome!: string; 


    @OneToMany(() => Jogador, (jogador) => jogador.nucleo)
    jogadores!: Jogador[];

    @OneToMany(() => Frequencia, (frequencia) => frequencia.nucleo)
    frequencias!: Frequencia[];

    @OneToMany(() => Chamada, (chamada) => chamada.nucleo)
    chamadas!: Chamada[];

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

    @OneToMany(() => Material, (material) => material.nucleo)
    materiais!: Material[]; 

    @OneToMany(() => Eventos, (eventos) => eventos.nucleo)
    eventos?: Eventos[];

}