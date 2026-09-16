import { Router } from 'express';
import multer from 'multer';
import GalleryModel, { GALLERY_CATEGORIES } from '../models/Gallery.js';
import { crudFactory } from '../utils/crudFactory.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/validate.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { uploadBuffer, destroyAsset, cloudinaryEnabled } from '../config/cloudinary.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new ApiError(400, 'Upload a JPEG, PNG, WebP or AVIF image.'));
    }
    cb(null, true);
  },
});

const c = crudFactory(GalleryModel, {
  allowed: ['title', 'alt', 'category', 'order', 'visible'],
  onDelete: (doc) => destroyAsset(doc.publicId),
});

const router = Router();
const guard = [requireAuth, requireAdmin];

router.get('/categories', (req, res) => res.json(GALLERY_CATEGORIES));
router.get('/', c.listPublic);
router.get('/all', guard, c.listAdmin);
router.patch('/reorder', guard, c.reorder);

/** Upload a new image and create its gallery record. */
router.post(
  '/',
  guard,
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
    const last = await GalleryModel.findOne().sort({ order: -1 }).select('order').lean();

    const doc = await GalleryModel.create({
      ...asset,
      title: (req.body.title || '').trim(),
      alt: (req.body.alt || '').trim(),
      category: GALLERY_CATEGORIES.includes(req.body.category) ? req.body.category : 'Other',
      order: last ? (last.order || 0) + 1 : 0,
      visible: req.body.visible !== 'false',
    });
    res.status(201).json(doc);
  })
);

/** Replace the file behind an existing record, keeping its metadata and position. */
router.post(
  '/:id/replace',
  guard,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!cloudinaryEnabled) throw new ApiError(503, 'Cloudinary credentials are not configured.');
    if (!req.file) throw new ApiError(400, 'Choose a replacement image.');

    const doc = await GalleryModel.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'That image no longer exists.');

    const oldPublicId = doc.publicId;
    const asset = await uploadBuffer(req.file.buffer);
    Object.assign(doc, asset);
    await doc.save();
    await destroyAsset(oldPublicId);

    res.json(doc);
  })
);

router.get('/:id', guard, c.getOne);
router.patch('/:id', guard, sanitizeBody, c.update);
router.delete('/:id', guard, c.remove);

export default router;
