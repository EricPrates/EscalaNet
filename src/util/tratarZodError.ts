import { ZodError } from "zod";
import { AppError } from "../Models/AppError";

export const converterZodError = (error: unknown): AppError => {
    if(error instanceof ZodError) {
        const detalhes = error.issues.map(e => `${e.path.join('.')} - ${e.message}`).join('\n');
        return new AppError(400, 'Dados de entrada inválidos', detalhes);
    }
    if (error instanceof AppError) {
        return error;
    }
    if (error instanceof Error) {
        return new AppError(500, 'Erro interno do servidor', error.message);
    }
    return new AppError(500, 'Erro interno do servidor', String(error));
}