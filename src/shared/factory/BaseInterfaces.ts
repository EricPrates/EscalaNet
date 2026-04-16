
export interface IBaseService<ResDTO, CreateDTO, ID = number> {
    listar(): Promise<ResDTO[]>;
    obterPorId(id: ID): Promise<ResDTO>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
}

export interface IBaseRepository<Entity, CreateDTO, ID = number> {
    listar(): Promise<Entity[]>;
    obterPorId(id: ID): Promise<Entity | null>;
    criar(data: CreateDTO): Promise<Entity>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
}

