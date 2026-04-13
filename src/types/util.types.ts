import { HTTP_STATUS } from '../util/sendMessages';

export interface BuildResponse {
    status: number;
    message: string;
    data?: any;
    detalhes?: string;
}

export interface AuthContext {
    id: number;
    name: string;
    email: string;
    role: 'coordenador' | 'admin';
}

export interface HTTP_STATUS {
     200: 'OK',
    201: 'Criado',
    202: 'Requisição aceita',
    204: 'Deletado com sucesso',
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    409: 'Conflito no recurso',
    422: 'Entidade não processável',
    500: 'Erro interno do servidor',
    502: 'Gateway ruim',
    503: 'Serviço indisponível',
    504: 'Gateway timeout',
}