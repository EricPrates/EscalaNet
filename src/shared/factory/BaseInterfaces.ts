

export interface IBaseService<ResDTO, CreateDTO, ID = number> {
    
    obterPorId(id: ID): Promise<ResDTO>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number, limite: number): Promise<{ data: ResDTO[]; meta: { total: number; totalPaginas: number; pagina: number; limite: number } }>;
}

export interface IBaseRepository<Entity, CreateDTO, ID = number> {
    obterPorId(id: ID): Promise<Entity | null>;
    criar(data: CreateDTO): Promise<Entity>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
    listar(pagina: number, limite: number): Promise<{ data: Entity[]; total: number }>;
}

