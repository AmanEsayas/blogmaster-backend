// src/models/user.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string; // Add role here
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Set default role to "user"
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
