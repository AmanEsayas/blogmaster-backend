// src/models/post.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId; // Reference to the User
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);
