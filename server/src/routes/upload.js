import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { uploadBuffer, destroyAsset, cloudinaryEnabled } from '../config/cloudinary.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/x-icon'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) return cb(new ApiError(400, 'That file type is not supported.'));
    cb(null, true);
  },
});

const router = Router();

/** One-off image upload used by the profile, workshop and settings forms. */
router.post(
  '/image',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!cloudinaryEnabled) {
      throw new ApiError(
        503,
        'Image uploads need Cloudinary credentials. Add them to the server .env file and restart.'
      );
    }
    if (!req.file) throw new ApiError(400, 'Choose an image to upload.');
    const asset = await uploadBuffer(req.file.buffer);
    res.status(201).json(asset);
  })
);

router.delete(
  '/image/:publicId(*)',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await destroyAsset(req.params.publicId);
    res.json({ deleted: true });
  })
);

router.get('/status', requireAuth, requireAdmin, (req, res) =>
  res.json({ cloudinary: cloudinaryEnabled })
);

export default router;
