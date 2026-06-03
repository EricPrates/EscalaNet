import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Postagem } from './postagem.model';
import { CriarPostagemDTO, RespostaPostagemDTO } from './postagem.schemas';

export interface IPostagemRepository {
    listar(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>): Promise<{ data: Postagem[]; total: number }>;
    obterPorFiltros(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>): Promise<{ data: Postagem[]; total: number }>;
    listarPublicados(): Promise<Postagem[]>;
    obterPorId(id: number, relations?: FindOptionsRelations<Postagem>): Promise<Postagem | null>;
    criar(data: CriarPostagemDTO): Promise<Postagem>;
    atualizar(id: number, data: Partial<CriarPostagemDTO>): Promise<Postagem | null>;
    deletar(id: number): Promise<boolean>;
}

export interface IPostagemService {
    listar(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>): Promise<any>;
    obterPorFiltros(pagina: number, limite: number, where?: FindOptionsWhere<Postagem>, relations?: FindOptionsRelations<Postagem>): Promise<any>;
    listarPublicados(pagina: number, limite: number): Promise<any>;
    obterPorId(id: number, relations?: FindOptionsRelations<Postagem>): Promise<RespostaPostagemDTO>;
    criar(data: CriarPostagemDTO): Promise<RespostaPostagemDTO>;
    atualizar(id: number, data: Partial<CriarPostagemDTO>): Promise<RespostaPostagemDTO>;
    deletar(id: number): Promise<boolean>;
}
