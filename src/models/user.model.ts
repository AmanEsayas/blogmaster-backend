import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },  // Ensure email is required
    password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
