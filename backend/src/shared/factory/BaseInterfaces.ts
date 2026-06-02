import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";


export interface IBaseService<ResDTO,FiltrosDTO, CreateDTO, ID = number, > {
    
    obterPorId(id: ID, relations?: FindOptionsRelations<ResDTO>): Promise<ResDTO>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number, limite: number, where?: FindOptionsWhere<ResDTO>, relations?: FindOptionsRelations<ResDTO>): Promise<{ data: ResDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
    obterPorFiltros(pagina: number | undefined, limite: number | undefined,where?: FindOptionsWhere<ResDTO>, relations?: FindOptionsRelations<ResDTO>): Promise<{ data: ResDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}

export interface IBaseRepository<Entity, CreateDTO, ID = number> {
    obterPorId(id: ID, relations?: FindOptionsRelations<Entity>, select?: FindOptionsSelect<Entity>, where?: FindOptionsWhere<Entity>): Promise<Entity | null>;
    criar(data: CreateDTO): Promise<Entity>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number | undefined, limite: number | undefined, where?: FindOptionsWhere<Entity>, relations?: FindOptionsRelations<Entity>, select?: FindOptionsSelect<Entity>): Promise<{ data: Entity[]; total: number }>;
    obterPorFiltros(pagina: number | undefined, limite: number | undefined,where?: FindOptionsWhere<Entity>, relations?: FindOptionsRelations<Entity>, select?: FindOptionsSelect<Entity>): Promise<{ data: Entity[]; total: number }>;
}

