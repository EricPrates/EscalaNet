
export interface MontarResposta {
    status: number;
    message: string;
    data?: any;
    detalhes?: string;
    token?: string;
}
export interface MontarRespostaPaginada<T> {
    message: string;
    data: T[];
    meta: {
        total: number;
        totalPaginas: number;
        pagina: number;
        limite: number;
    };
}

export type PropiedadesDeValidacao = ['body'] | ['query'] | ['params'] | ['headers'] | ['cookies'];

export type Entidades = 'Usuario' | 'Nucleo' | 'Treino' | 'Frequencia' | 'Jogo' | 'EventosJogo' | 'Aluno';
export interface AuthContext {
    id: number;
    nome: string;
    email: string;
    permissao: 'coordenador' | 'admin' | 'professor' | 'arbitro' | 'auxiliar';
    nucleoVinculado?: {
        id: number;
        nome: string;
    } | null;

}

export const HTTP_STATUS_ERRORS: { [key: number]: string } = {
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

} ;