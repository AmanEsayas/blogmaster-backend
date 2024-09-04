import { Router, Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Registration route
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Simple validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);

        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

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

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a token
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
