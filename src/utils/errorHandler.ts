const { AppError } = require('./AppError');

const errorHandler = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered',
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el: any) => el.message);
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