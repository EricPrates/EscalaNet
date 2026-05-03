import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "../jogo/Jogo.model";
import { Usuario } from "../usuario/Usuario.model";
import { Jogador } from "../jogador/jogador.model";
import { Time } from "../time/time.model";
import { TipoEvento } from "./TipoEvento";


@Entity({ name: "eventos_jogo" })
export class EventosJogo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    tipo!: TipoEvento;

    @Column({ type: "varchar", length: 1000, nullable: true })
    descricao!: string | null;

    @Column({ type: "int", nullable: false })
    minuto!: number;

    @Index()
    @ManyToOne(() => Jogo, (jogo) => jogo.eventos)
    @JoinColumn({ name: "jogo_id" })
    jogo!: Jogo;

    @Index()
    @ManyToOne(() => Usuario, (usuario) => usuario.eventos)
    @JoinColumn({ name: "usuario_id" })
    usuario!: Usuario;

    @Index()
    @ManyToOne(() => Time, (time) => time.eventos)
    @JoinColumn({ name: "time_id" })
    time!: Time;

    @Index()
    @ManyToOne(() => Jogador, (jogador) => jogador.eventos, { nullable: true })
    @JoinColumn({ name: "jogador_envolvido_id" })
    jogadorEnvolvido!: Jogador | null;

    @Column({ type: "int", nullable: true })
    acescimo!: number | null;




}