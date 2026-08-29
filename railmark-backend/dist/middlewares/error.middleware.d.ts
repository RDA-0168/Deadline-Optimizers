import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    errors?: any[];
    constructor(message: string, statusCode?: number, errors?: any[]);
}
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction): void;
