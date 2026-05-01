import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "../jogo/Jogo.model";
import { Usuario } from "../usuario/Usuario.model";
import { Jogador } from "../jogador/jogador.model";
import { Time } from "../time/time.model";



@Entity({ name: "eventos_jogo" })
export class EventosJogo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: ["gol", "falta", "cartao_amarelo", "cartao_vermelho", "escanteio", "substituicao"], nullable: false })
    tipo!: "gol" | "falta" | "cartao_amarelo" | "cartao_vermelho" | "escanteio" | "substituicao";

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
    @ManyToOne(() => Jogador, (jogador) => jogador.eventos)
    @JoinColumn({ name: "jogador_envolvido_id" })
    jogadorEnvolvido!: Jogador | null;




}