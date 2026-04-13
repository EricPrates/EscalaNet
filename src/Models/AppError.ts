export class AppError extends Error {
    constructor(statusCode: number, message?: string, detalhes?: string) {
        super(message || 'Erro inesperado');
        this.statusCode = statusCode;
        this.detalhes = detalhes || '';
    }
    statusCode: number;
    detalhes: string;

}