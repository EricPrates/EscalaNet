
import { NextFunction, Request, Response } from 'express';
import { converterZodError } from "../util/tratarZodError";
import { z } from 'zod';
import { PropiedadesDeValidacao } from '../Interfaces/util.types';



export function validate<T>(schema: z.ZodType<T>, ...propriedade: PropiedadesDeValidacao) {
    return async function (req: Request, _res: Response, next: NextFunction) {
        try {
            for (const p of propriedade) {
                if (req[p]) {
                    const data = await schema.parseAsync(req[p]);
                    (req as any)[p] = data;
                }
            }
            next();
        } catch (err) {
            next(converterZodError(err));
        }
    };
}