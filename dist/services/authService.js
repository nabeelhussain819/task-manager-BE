const User = require('../models/User');
const { AppError } = require('../utils/AppError');
class AuthService {
    async register(username, password) {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new AppError('Username already exists', 400);
        }
        // Create new user
        const user = new User({ username, password });
        await user.save();
        return { user };
    }
    async login(username, password) {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }
        return { user };
    }
    async getUserById(userId) {
        return await User.findById(userId).select('-password');
    }
}
module.exports = { AuthService };
