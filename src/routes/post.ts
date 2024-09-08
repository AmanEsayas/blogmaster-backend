// src/routes/post.ts
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/post.model';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Create a new blog post
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;
      const userId = req.user?.id; // assuming req.user is set by authMiddleware

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const post = new Post({ title, content, author: userId });
      await post.save();

      res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get all posts
router.get('/', async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

// Update a post
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    try {
        const post = await Post.findById(req.params.id);

        if (!post || post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        post.title = title;
        post.content = content;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const post = await Post.findById(req.params.id);

        if (!post || post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});

export default router;
