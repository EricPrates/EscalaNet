import { AnyZodObject } from "zod/v3";
import { NextFunction, Request, Response } from 'express';
import {converterZodError} from "../util/tratarZodError";

export const validateBody = (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (err) {
        next(converterZodError(err));
    }

};
export const validateQuery = (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.query = await schema.parseAsync(req.query);
        next();
    } catch (err) {
        next(converterZodError(err));
    }
};
export const validateParams = (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.params = await schema.parseAsync(req.params);
        next();
    } catch (err) {
        next(converterZodError(err));
    }
};