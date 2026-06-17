import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';


export interface IBaseService<ResDTO,Entity, CreateDTO, ID = number, > {
    
    obterPorId(id: ID, relations?: FindOptionsRelations<Entity>): Promise<ResDTO | null>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number, limite: number, where?: FindOptionsWhere<Entity> | Entity, relations?: FindOptionsRelations<Entity>): Promise<{ data: ResDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}

export interface IBaseRepository<Entity, DataRepo, ID = number> {
    obterPorId(id: ID, relations?: FindOptionsRelations<Entity>, select?: FindOptionsSelect<Entity>, where?: FindOptionsWhere<Entity>): Promise<Entity | null>;
    criar(data: DataRepo ): Promise<Entity>;
    atualizar(id: ID, data: Partial<DataRepo>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number | undefined, limite: number | undefined, where?: FindOptionsWhere<Entity> , relations?: FindOptionsRelations<Entity>, select?: FindOptionsSelect<Entity>): Promise<{ data: Entity[]; total: number }>;
   
}

