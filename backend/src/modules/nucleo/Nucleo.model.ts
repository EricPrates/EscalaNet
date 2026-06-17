import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Treino } from '../treino/Treino.model';
import { Time } from '../time/time.model';

import { Usuario } from '../usuario/Usuario.model';
import { Chamada } from '../chamada/chamada.model';
import { EventosJogo } from '../eventos_jogo/EventosJogo.model';
import { Frequencia } from '../frequencia/frequencia.model';
import { Jogador } from '../jogador/jogador.model';



@Entity({ name: "nucleos" })
export class Nucleo {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => EventosJogo, (eventosJogo) => eventosJogo.nucleo)
    eventos!: EventosJogo[];

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

    @ManyToOne(() => Nucleo, (nucleo) => nucleo.materiais)
    @JoinColumn({ name: "nucleo_recebedor_id"})
    materiais!: Nucleo; 



}