import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';

function readToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return req.cookies?.token || null;
}

/** Rejects anything without a valid, current token. */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (!token) throw new ApiError(401, 'Sign in to continue.');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Your session has expired. Sign in again.');
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin) throw new ApiError(401, 'That account no longer exists.');
  if ((admin.tokenVersion || 0) !== (payload.v || 0)) {
    throw new ApiError(401, 'Your password changed. Sign in again.');
  }

  req.admin = admin;
  next();
});

export function requireAdmin(req, res, next) {
  if (req.admin?.role !== 'admin') return next(new ApiError(403, 'Admin access only.'));
  next();
}

export function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), v: admin.tokenVersion || 0 }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
