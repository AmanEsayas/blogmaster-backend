// src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const checkRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};
