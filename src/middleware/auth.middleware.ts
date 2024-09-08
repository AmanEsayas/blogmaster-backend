// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { Document } from 'mongoose';

// Extend the request interface to include user id and role
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id) as (Document<unknown, {}, IUser> & IUser & { _id: string, role: string });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
