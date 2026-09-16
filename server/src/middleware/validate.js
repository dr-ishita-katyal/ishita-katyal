import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, 'Some fields need attention.', details));
}

/** Strips angle brackets from every string in the body to blunt stored-XSS attempts. */
export function sanitizeBody(req, res, next) {
  const clean = (value) => {
    if (typeof value === 'string') return value.replace(/[<>]/g, '').trim();
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object') {
      for (const k of Object.keys(value)) value[k] = clean(value[k]);
      return value;
    }
    return value;
  };
  if (req.body && typeof req.body === 'object') req.body = clean(req.body);
  next();
}
