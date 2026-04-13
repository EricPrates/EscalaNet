
import { NextFunction, Request, Response } from 'express';
import {converterZodError} from "../util/tratarZodError";
import { z } from "zod";


export const validateBody = (schema: z.ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (err) {
        next(converterZodError(err));
    }

};
export const validateQuery = (schema: z.ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const validado = await schema.parseAsync(req.query);
        req.query = validado as any;
        next();
    } catch (err) {
        next(converterZodError(err));
    }
};
export const validateParams = (schema: z.ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const validado = await schema.parseAsync(req.params);
        req.params = validado as any;
        next();
    } catch (err) {
        next(converterZodError(err));
    }
};