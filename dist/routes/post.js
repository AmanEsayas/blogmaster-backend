"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/post.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const post_model_1 = __importDefault(require("../models/post.model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Create a new blog post
router.post('/', auth_middleware_1.default, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // assuming req.user is set by authMiddleware
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = new post_model_1.default({ title, content, author: userId });
        yield post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}));
// Get all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find().populate('author', 'username');
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}));
// Update a post
router.put('/:id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (!post || post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }
        post.title = title;
        post.content = content;
        yield post.save();
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
}));
// Delete a post
router.delete('/:id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (!post || post.author.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        yield post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}));
exports.default = router;
