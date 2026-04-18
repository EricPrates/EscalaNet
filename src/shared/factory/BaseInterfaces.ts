import { FindOptionsWhere } from "typeorm";
import { Usuario } from "../../modules/usuario/Usuario.model";

export interface IBaseService<ResDTO, CreateDTO, ID = number> {
    listar(pagina: number, limite: number, filtros?: FindOptionsWhere<Usuario>): Promise<{ data: ResDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    obterPorId(id: ID): Promise<ResDTO>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
}

export interface IBaseRepository<Entity, CreateDTO, ID = number> {
    listar(page: number, limit: number, filtros?: FindOptionsWhere<Usuario>): Promise<{ data: Entity[], total: number}>;
    obterPorId(id: ID): Promise<Entity | null>;
    criar(data: CreateDTO): Promise<Entity>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
    
}

