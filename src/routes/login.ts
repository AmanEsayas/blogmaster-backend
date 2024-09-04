import { Router, Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Login route
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Simple validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error('Error during login:', error);

        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

export default router;
