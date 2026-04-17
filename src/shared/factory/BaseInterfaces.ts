
export interface IBaseService<ResDTO, CreateDTO, ID = number> {
   listar(page: number, limit: number): Promise<{
        data: ResDTO[];
        meta: {
            pagina: number;
            limite: number;
            total: number;
            totalPaginas: number;
        }
    }>;
    obterPorId(id: ID): Promise<ResDTO>;
    criar(data: CreateDTO): Promise<ResDTO>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<ResDTO>;
    deletar(id: ID): Promise<boolean>;
}

export interface IBaseRepository<Entity, CreateDTO, ID = number> {
    listar(page: number, limit: number): Promise<{ data: Entity[], total: number }>;
    obterPorId(id: ID): Promise<Entity | null>;
    criar(data: CreateDTO): Promise<Entity>;
    atualizar(id: ID, data: Partial<CreateDTO>): Promise<Entity | null>;
    deletar(id: ID): Promise<boolean>;
}

