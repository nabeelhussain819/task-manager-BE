const User = require('../models/User');
const { AppError } = require('../utils/AppError');

class AuthService {
  async register(username: string, password: string): Promise<{ user: any }> {
   
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }

    const user = new User({ username, password });
    await user.save();

    return { user };
  }

  async login(username: string, password: string): Promise<{ user: any }> {
 
    const user = await User.findOne({ username });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return { user };
  }

  async getUserById(userId: string): Promise<any> {
    return await User.findById(userId).select('-password');
  }
}

module.exports = { AuthService };