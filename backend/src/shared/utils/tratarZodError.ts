import { ZodError } from "zod";
import { AppError } from "./AppError";

export function converterZodError(error: unknown): AppError {
    if (error instanceof ZodError) {
        const detalhes = error.issues
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join('; ');
        return new AppError(400, 'Dados de entrada inválidos', detalhes);
    }
    
    if (error instanceof AppError) {
        return error;
    }

    console.error('Erro não tratado:', error);
    return new AppError(500, 'Erro interno do servidor');
}