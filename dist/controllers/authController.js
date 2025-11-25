const jwt = require('jsonwebtoken');
const { AuthService } = require('../services/authService');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const authService = new AuthService();
const register = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new AppError('Username and password are required', 400);
    }
    const { user } = await authService.register(username, password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.status(201).json({
        token,
        user: { id: user._id, username: user.username }
    });
});
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new AppError('Username and password are required', 400);
    }
    const { user } = await authService.login(username, password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({
        token,
        user: { id: user._id, username: user.username }
    });
});
const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    res.json({
        user: { id: user._id, username: user.username }
    });
});
module.exports = {
    register,
    login,
    getProfile
};
