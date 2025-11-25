const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Access token required', 401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      throw new AppError('Invalid token', 403);
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };