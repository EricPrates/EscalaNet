
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    Index 
} from 'typeorm';

@Entity({ name: "postagens" })
export class Postagem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ length: 200 })
    titulo!: string;

    @Column({ type: 'text' })
    conteudo!: string; // Pode ser HTML ou markdown

    @Column({ nullable: true })
    imagemUrl?: string; // URL da imagem de destaque

    @Column({ nullable: true })
    resumo?: string; // Resumo curto para listagens

    @Column({ default: 'rascunho' })
    status!: 'rascunho' | 'publicado'; // Controle de exibição

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ nullable: true })
    publicadoEm?: Date; // Data de publicação (pode ser futura)
}