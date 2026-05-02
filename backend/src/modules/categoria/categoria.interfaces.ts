import { IBaseRepository, IBaseService } from "../../shared/factory/BaseInterfaces";
import { Categoria } from "./Categoria.model";
import { CriarCategoriaDTO, RespostaCategoriaDTO } from "./categoria.schemas";

export interface ICategoriaRepository extends IBaseRepository<Categoria, CriarCategoriaDTO> {
    obterPorNome(nome: string): Promise<Categoria | null>;
}

export interface ICategoriaService extends IBaseService<RespostaCategoriaDTO, CriarCategoriaDTO> {
    obterPorNome(nome: string): Promise<RespostaCategoriaDTO>;
}
