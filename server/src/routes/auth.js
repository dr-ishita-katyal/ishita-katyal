import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import Admin from '../models/Admin.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

router.post(
  '/login',
  loginLimiter,
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Enter your password.'),
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    // Same message either way so the form can't be used to enumerate accounts.
    const ok = admin && (await admin.comparePassword(password));
    if (!ok) throw new ApiError(401, 'That email and password combination is not recognised.');

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signToken(admin);
    res.cookie('token', token, cookieOptions());
    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  })
);

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  const { _id, name, email, role, lastLoginAt } = req.admin;
  res.json({ admin: { id: _id, name, email, role, lastLoginAt } });
});

router.patch(
  '/password',
  requireAuth,
  body('currentPassword').notEmpty().withMessage('Enter your current password.'),
  body('newPassword')
    .isLength({ min: 10 })
    .withMessage('Use at least 10 characters for the new password.'),
  validate,
  asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.comparePassword(req.body.currentPassword))) {
      throw new ApiError(401, 'Your current password is not correct.');
    }
    admin.password = req.body.newPassword;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1; // invalidate existing sessions
    await admin.save();

    const token = signToken(admin);
    res.cookie('token', token, cookieOptions());
    res.json({ token, message: 'Password updated.' });
  })
);

router.patch(
  '/account',
  requireAuth,
  body('name').optional().isLength({ min: 2 }).withMessage('Name is too short.'),
  body('email').optional().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  validate,
  asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);
    if (req.body.name !== undefined) admin.name = req.body.name;
    if (req.body.email !== undefined) admin.email = req.body.email;
    await admin.save();
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  })
);

export default router;
