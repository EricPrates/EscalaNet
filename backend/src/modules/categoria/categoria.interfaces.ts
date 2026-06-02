
import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO, FiltrosCategoriaDTO, RespostaCategoriaDTO } from "./categoria.schemas";

export interface ICategoriaRepository extends IBaseRepository<Categoria, CriarCategoriaDTO> {
    obterPorNome(nome: string): Promise<Categoria | null>;
    buscarPorIdadeMaxima(idadeMaxima: number): Promise<Categoria | null>;
}

export interface ICategoriaService extends IBaseService< RespostaCategoriaDTO, FiltrosCategoriaDTO, CriarCategoriaDTO, number> {
    obterPorNome(nome: string): Promise<RespostaCategoriaDTO>;
    buscarPorIdadeMaxima(idadeMaxima: number): Promise<RespostaCategoriaDTO | null>;
}
