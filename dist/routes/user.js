"use strict";
// src/routes/user.ts
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
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Registration route
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ username, email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ message: 'Server error', error: errorMessage });
    }
}));
// Login route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ message: 'Server error', error: errorMessage });
    }
}));
// Protected route to get user profile
router.get('/profile', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Typecast the request as AuthRequest to access the `user` property
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = yield user_model_1.default.findById(userId).select('-password'); // Exclude the password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/profile', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, email } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Use optional chaining
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Update the user
        const user = yield user_model_1.default.findByIdAndUpdate(userId, { username, email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}));
exports.default = router;
