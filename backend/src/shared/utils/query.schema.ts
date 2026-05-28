import { z } from "zod";
import { FindOptionsRelations } from 'typeorm';

export function criarIncludesSchema(relacoesPermitidas: readonly string[]) {
    if (relacoesPermitidas.length === 0) {
        return z.object({
            includes: z.string().optional()
                .transform(() => [])
                .default([])
        });
    }
    
    return z.object({
        includes: z.string().optional()
            .transform(val => val ? val.split(',').map(s => s.trim()) : [])
            .pipe(
                z.array(z.string()).refine(
                    (arr) => arr.every(rel => relacoesPermitidas.includes(rel)),
                    {
                        message: `Includes inválido. Permitidos: ${relacoesPermitidas.join(', ')}`
                    }
                )
            )
            .default([])
    });
}

export function transformarIncludesEmRelations(includes: string[]): FindOptionsRelations<any> {
    return includes.reduce((acc, rel) => ({ ...acc, [rel]: true }), {});
}



