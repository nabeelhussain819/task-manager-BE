const { AppError } = require('./AppError');
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // MongoDB duplicate key error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(400).json({
            status: 'error',
            message: 'Duplicate field value entered',
        });
    }
    // MongoDB validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((el) => el.message);
        return res.status(400).json({
            status: 'error',
            message: `Invalid input data: ${errors.join('. ')}`,
        });
    }
    console.error('Error 💥:', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};
module.exports = { errorHandler };
