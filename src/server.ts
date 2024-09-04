import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Basic route to check server status
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to BlogMaster API');
});

// Use user routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
