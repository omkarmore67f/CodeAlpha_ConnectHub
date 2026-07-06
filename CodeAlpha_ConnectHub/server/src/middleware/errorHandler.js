import { env } from '../config/env.js';

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  // Handle Mongoose duplicate key error (MongoDB code 11000)
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
    message = `${formattedField} is already taken or registered`;
  }

  // Handle Mongoose ValidationError
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors || {})
      .map((el) => el.message)
      .join('. ');
  }

  res.status(statusCode).json({
    message,
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });
}
