
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
} as const;
export const STANDARD_MESSAGES = {
    CREATED: 'Recurso criado com sucesso',
    UPDATED: 'Recurso atualizado com sucesso',
    DELETED: 'Recurso deletado com sucesso',
    FETCHED: 'Dados recuperados com sucesso',
    SUCCESS: 'Sucesso',
    BAD_REQUEST: 'Requisição inválida',
    UNAUTHORIZED: 'Não autorizado',
    FORBIDDEN: 'Acesso negado',
    NOT_FOUND: 'Recurso não encontrado',
    CONFLICT: 'Conflito no recurso',
    UNPROCESSABLE_ENTITY: 'Entidade não processável',
    INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
    BAD_GATEWAY: 'Gateway ruim',
    SERVICE_UNAVAILABLE: 'Serviço indisponível',
    NO_CONTENT: 'Sem conteúdo',
    ACCEPTED: 'Requisição aceita',
    NO_TOKEN: 'Token não fornecido',
    MALFORMED_TOKEN: 'Token mal formatado',
    INVALID_TOKEN: 'Token inválido ou expirado',
    INSUFFICIENT_PRIVILEGES: 'Acesso negado: privilégios insuficientes',
    USER_NOT_FOUND: 'Usuário não encontrado',
    INVALID_CREDENTIALS: 'Credenciais inválidas',
    

} as const;

    export const AUTH_ERRORS = {
        NO_TOKEN: 'Token não fornecido',
        MALFORMED_TOKEN: 'Token mal formatado',
        INVALID_TOKEN: 'Token inválido ou expirado',
        INSUFFICIENT_PRIVILEGES: 'Acesso negado: privilégios insuficientes',
        USER_NOT_FOUND: 'Usuário não encontrado',
        INVALID_CREDENTIALS: 'Credenciais inválidas',
        FORBIDDEN: 'Acesso negado'
    } as const;

export const USER_ERRORS = {
    NOT_FOUND: 'Usuário não encontrado',
    ALREADY_EXISTS: 'Usuário já existe',
    EMAIL_IN_USE: 'Email já está em uso',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PASSWORD: 'Senha inválida'
} as const;

export const TASK_ERRORS = {
    NOT_FOUND: 'Tarefa não encontrada',
    ALREADY_EXISTS: 'Tarefa já existe',
    INVALID_DATA: 'Dados da tarefa inválidos',
    UNAUTHORIZED: 'Sem permissão para esta tarefa'
} as const;
    
export const SERVER_ERRORS = {
    INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
    SERVICE_UNAVAILABLE: 'Serviço indisponível',
    BAD_GATEWAY: 'Gateway ruim'
} as const;