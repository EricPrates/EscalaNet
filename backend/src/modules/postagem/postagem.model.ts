import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    Index, 
    OneToOne
} from 'typeorm';
import { Usuario } from '../usuario/Usuario.model';

@Entity({ name: "postagens" })
export class Postagem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ length: 200 })
    titulo!: string;

    @Column({ type: 'text' })
    conteudo!: string;

    @Column({ nullable: true })
    imagemUrl?: string;

    @Column({ nullable: true })
    resumo?: string;

    @Column({ default: 'rascunho' })
    status!: 'rascunho' | 'publicado';

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ nullable: true })
    publicadoEm?: Date;

    @OneToOne(() => Usuario, (usuario) => usuario.postagem)
    autor!: Usuario;
}
