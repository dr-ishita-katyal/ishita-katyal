import ApiError from '../utils/ApiError.js';

export function notFound(req, res) {
  res.status(404).json({ message: `No API route matches ${req.method} ${req.originalUrl}` });
}

/* eslint-disable no-unused-vars */
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong on the server.';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = 'Some fields need attention.';
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'That identifier is not valid.';
  }
  // A buffering timeout means the database is unreachable, not that the caller
  // did anything wrong.
  if (/buffering timed out/i.test(err.message || '') || err.name === 'MongooseServerSelectionError') {
    status = 503;
    message = 'The database is not reachable. Check MONGO_URI and that MongoDB is running.';
  }
  if (err.code === 11000) {
    status = 409;
    message = `A record with that ${Object.keys(err.keyValue || {}).join(', ')} already exists.`;
  }
  if (err instanceof ApiError === false && status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Something went wrong on the server.';
  }

  res.status(status).json({ message, details });
}
