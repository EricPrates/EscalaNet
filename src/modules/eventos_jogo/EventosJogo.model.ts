import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "../jogo/Jogo.model";
import { Usuario } from "../usuario/Usuario.model";
import { Nucleo } from "../nucleo/Nucleo.model";
import { Aluno } from "../aluno/Aluno.model";


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
    @ManyToOne(() => Nucleo, (nucleo) => nucleo.eventos)
    @JoinColumn({ name: "nucleo_id" })
    nucleo!: Nucleo;

    @Index()
    @ManyToOne(() => Aluno, (aluno) => aluno.eventos)
    @JoinColumn({ name: "aluno_envolvido_id" })
    alunoEnvolvido!: Aluno | null;
}