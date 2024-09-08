"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};
exports.checkRole = checkRole;
