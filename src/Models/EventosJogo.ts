import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "./Jogo";

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

    @ManyToOne(() => Jogo, (jogo) => jogo.eventos)
    @JoinColumn({ name: "jogo_id" })
    jogo!: Jogo;
}