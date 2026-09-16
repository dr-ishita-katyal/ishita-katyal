import mongoose from 'mongoose';
import { orderableFields } from './shared.js';

export const GALLERY_CATEGORIES = [
  'Portraits',
  'Academic',
  'Conferences',
  'Workshops',
  'Professional',
  'Other',
];

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    alt: { type: String, trim: true, default: '' },
    category: { type: String, enum: GALLERY_CATEGORIES, default: 'Other', index: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true, default: '' },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    ...orderableFields,
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, order: 1 });
export default mongoose.model('Gallery', gallerySchema);
