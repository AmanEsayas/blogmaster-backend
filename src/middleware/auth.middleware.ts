// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { Document } from 'mongoose';

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Fetch the user from the database using the decoded ID from the token
        const user = await User.findById(decoded.id) as (Document<unknown, {}, IUser> & IUser & { _id: string });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user ID to the request object for later use
        req.user = { id: user._id.toString() };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
