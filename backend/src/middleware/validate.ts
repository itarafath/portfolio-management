import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                _res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: errorMessages,
                });
                return;
            }
            next(error);
        }
    };
};
