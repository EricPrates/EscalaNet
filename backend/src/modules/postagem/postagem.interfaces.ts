// src/modules/postagem/postagem.interfaces.ts
import { IBaseRepository, IBaseService } from '../../shared/factory/BaseInterfaces';
import { Postagem } from './postagem.model';

import { CriarPostagemDTO, RespostaPostagemDTO } from './postagem.schemas';
import { FindOptionsWhere } from 'typeorm';

export interface IPostagemRepository extends IBaseRepository<Postagem, CriarPostagemDTO> {
    // Métodos específicos se necessário
    listarPublicados(): Promise<Postagem[]>;
}

export interface IPostagemService extends IBaseService<RespostaPostagemDTO, FindOptionsWhere<Postagem>, CriarPostagemDTO, number> {
    listarPublicados(pagina: number, limite: number): Promise<{ data: RespostaPostagemDTO[]; meta: any }>;
}